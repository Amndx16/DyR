import polars as pl
import os

# Configuraciones de rutas
INPUT_DIR = "raw"
OUTPUT_DIR = "clean"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def preprocesar_ventas(nombre_archivo, es_train=True):
    print(f"⚡ Leyendo y procesando {nombre_archivo} de forma paralela...")
    
    cols = ["customer_id", "calmonth", "num_transacciones", "uni_boxes_sold_m"]
    if es_train:
        cols.append("target")
        
    # 1. Lectura veloz multi-hilo forzando strings para evitar errores de tipo
    pl_df = pl.read_csv(
        f"{INPUT_DIR}/{nombre_archivo}", 
        has_header=False, 
        new_columns=cols,
        schema_overrides={c: pl.Utf8 for c in cols}
    )
    
    # Quitar cabeceras duplicadas si se colaron en el archivo
    pl_df = pl_df.filter(pl.col("customer_id") != "customer_id")
    
    # 2. Limpieza de IDs y Fechas
    pl_df = pl_df.with_columns([
        pl.col("customer_id").str.strip_chars().str.to_lowercase(),
        pl.col("calmonth").str.strip_chars().str.replace_all("-", "").str.replace_all("/", "")
    ])
    
    pl_df = pl_df.filter(pl.col("calmonth").str.len_chars() == 6)
    pl_df = pl_df.with_columns(pl.col("calmonth").cast(pl.Int32))
    
    # 3. Casteo Numérico Limpiando Negativos
    for col in ["num_transacciones", "uni_boxes_sold_m"]:
        pl_df = pl_df.with_columns(
            pl.col(col).cast(pl.Float64, strict=False).clip(lower_bound=0)
        )
        
    if es_train:
        pl_df = pl_df.with_columns(
            pl.col("target").cast(pl.Float64, strict=False).round().clip(0, 1).cast(pl.Int32)
        )
        pl_df = pl_df.drop_nulls(subset=["target"])
        
    # 4. Imputación Veloz de Nulos usando la Mediana del Cliente (Sin lambdas lentos)
    medianas = pl_df.group_by("customer_id").agg([
        pl.col("num_transacciones").median().alias("mediana_trans"),
        pl.col("uni_boxes_sold_m").median().alias("mediana_cajas")
    ])
    
    pl_df = pl_df.join(medianas, on="customer_id", how="left")
    
    pl_df = pl_df.with_columns([
        pl.col("num_transacciones").fill_null(pl.col("mediana_trans")).fill_null(0).cast(pl.Int32),
        pl.col("uni_boxes_sold_m").fill_null(pl.col("mediana_cajas")).fill_null(0.0)
    ]).drop(["mediana_trans", "mediana_cajas"])
    
    # Quitar duplicados mensuales
    return pl_df.unique(subset=["customer_id", "calmonth"], keep="last")

def preprocesar_clientes():
    print("📋 Procesando archivo de Clientes...")
    df = pl.read_csv(
        f"{INPUT_DIR}/Clientes.csv", 
        has_header=False, 
        new_columns=["customer_id", "territory_d", "comercial_subchannel_d", "rtm_customer_size_d"],
        schema_overrides={c: pl.Utf8 for c in ["customer_id", "territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]}
    )
    
    df = df.with_columns([
        pl.col("customer_id").str.strip_chars().str.to_lowercase(),
        pl.col("territory_d").str.strip_chars().str.to_titlecase().fill_null("Desconocido"),
        pl.col("comercial_subchannel_d").str.strip_chars().str.to_titlecase().fill_null("Desconocido"),
        pl.col("rtm_customer_size_d").str.strip_chars().str.to_titlecase().fill_null("Desconocido")
    ])
    return df.unique(subset=["customer_id"], keep="first")

def preprocesar_coolers():
    print("🧊 Procesando archivo de Coolers...")
    df = pl.read_csv(
        f"{INPUT_DIR}/Coolers.csv",
        has_header=False,
        new_columns=["customer_id", "calmonth", "num_coolers", "num_doors"],
        schema_overrides={c: pl.Utf8 for c in ["customer_id", "calmonth", "num_coolers", "num_doors"]}
    )
    df = df.filter(pl.col("customer_id") != "customer_id")
    df = df.with_columns([
        pl.col("customer_id").str.strip_chars().str.to_lowercase(),
        pl.col("calmonth").str.strip_chars().cast(pl.Int32, strict=False),
        pl.col("num_coolers").cast(pl.Int32, strict=False).clip(lower_bound=0).fill_null(0),
        pl.col("num_doors").cast(pl.Int32, strict=False).clip(lower_bound=0).fill_null(0)
    ]).drop_nulls(subset=["calmonth"])
    
    # Nos quedamos con el último registro conocido por mes
    return df.unique(subset=["customer_id", "calmonth"], keep="last")

def generar_features_y_unificar(df_sales, df_clientes, df_coolers):
    print("🔧 Extrayendo ingeniería de características en paralelo...")
    
    # Feature engineering temporal avanzado desde Rust
    feats_sales = df_sales.group_by("customer_id").agg([
        pl.col("calmonth").count().alias("meses_activo"),
        pl.col("num_transacciones").mean().alias("promedio_transacciones"),
        pl.col("num_transacciones").std().alias("std_transacciones").fill_null(0.0),
        pl.col("num_transacciones").max().alias("max_transacciones"),
        pl.col("uni_boxes_sold_m").mean().alias("promedio_cajas"),
        pl.col("uni_boxes_sold_m").max().alias("max_cajas"),
        pl.col("uni_boxes_sold_m").min().alias("min_cajas"),
        pl.col("calmonth").max().alias("ultimo_calmonth")
    ])
    
    # Tendencia lineal matemática vectorizada sin polyfit: Cov(X,Y) / Var(X)
    df_tendencia = df_sales.sort(["customer_id", "calmonth"]).with_columns(
        pl.col("calmonth").cum_count().over("customer_id").alias("t_index")
    )
    
    tendencias = df_tendencia.group_by("customer_id").agg([
        (pl.cov("t_index", "uni_boxes_sold_m") / pl.var("t_index")).alias("tendencia_cajas").fill_null(0.0)
    ])
    
    # Unir todo el set de comportamiento comercial
    master_sales = feats_sales.join(tendencias, on="customer_id", how="left")
    
    # Extraer el estado más reciente de coolers
    coolers_recientes = df_coolers.sort(["customer_id", "calmonth"]).group_by("customer_id").last()
    coolers_recientes = coolers_recientes.select([
        "customer_id", 
        pl.col("num_coolers").alias("num_coolers_reciente"), 
        pl.col("num_doors").alias("num_doors_reciente")
    ])
    
    # Ensamblaje final
    final_df = master_sales.join(df_clientes, on="customer_id", how="left")
    final_df = final_df.join(coolers_recientes, on="customer_id", how="left")
    
    # Rellenar nulos de clientes que no posean registros de refrigeradores
    return final_df.with_columns([
        pl.col("num_coolers_reciente").fill_null(0),
        pl.col("num_doors_reciente").fill_null(0),
        pl.col("territory_d").fill_null("Desconocido"),
        pl.col("comercial_subchannel_d").fill_null("Desconocido"),
        pl.col("rtm_customer_size_d").fill_null("Desconocido")
    ])

if __name__ == "__main__":
    print("🚀 INICIANDO PIPELINE DE LIMPIEZA POLARS (MÁXIMA VELOCIDAD) 🚀\n")
    
    # Cargar maestros
    clientes = preprocesar_clientes()
    coolers = preprocesar_coolers()
    
    # Procesar ventas
    sales_train = preprocesar_ventas("sales_churn_train.csv", es_train=True)
    sales_test = preprocesar_ventas("sales_churn_test.csv", es_train=False)
    
    # Construir datasets unificados consolidados
    train_clean = generar_features_y_unificar(sales_train, clientes, coolers)
    # Re-inyectar el target correspondiente mapeado
    target_map = sales_train.unique(subset=["customer_id"], keep="last").select(["customer_id", "target"])
    train_clean = train_clean.join(target_map, on="customer_id", how="left")
    
    test_clean = generar_features_y_unificar(sales_test, clientes, coolers)
    test_target_map = sales_train.unique(subset=["customer_id"], keep="last").select(["customer_id", "target"]) # Validar contra el target conocido
    test_clean = test_clean.join(test_target_map, on="customer_id", how="left").drop_nulls(subset=["target"])
    
    # Guardar en disco los archivos limpios
    train_clean.write_csv(f"{OUTPUT_DIR}/train_consolidado.csv")
    test_clean.write_csv(f"{OUTPUT_DIR}/test_consolidado.csv")
    
    print(f"\n✅ ¡Limpieza completada con éxito! Archivos generados en la carpeta '{OUTPUT_DIR}/'")