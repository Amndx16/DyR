"""
╔══════════════════════════════════════════════════════════════╗
║         CHURN HUNTERS — Pipeline Optimizado                  ║
║   Limpieza → Merge → Features → Encoding → XGBoost          ║
║   CAMBIOS: features_sales() vectorizado, sin .apply()        ║
╚══════════════════════════════════════════════════════════════╝
"""

import pandas as pd
import numpy as np
import os
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

INPUT_DIR  = "raw"
OUTPUT_DIR = "clean"
MODEL_DIR  = "modelo"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)


# ════════════════════════════════════════════════════════
#  UTILIDADES COMUNES
# ════════════════════════════════════════════════════════

def reporte(nombre, df_raw, df_clean):
    print(f"\n{'─'*52}")
    print(f"  📄 {nombre}")
    print(f"{'─'*52}")
    print(f"  Filas   : {len(df_raw):>8,}  →  {len(df_clean):>8,}")
    print(f"  Nulos   : {df_raw.isnull().sum().sum():>8,}  →  {df_clean.isnull().sum().sum():>8,}")
    print(f"  Dupes   : {df_raw.duplicated().sum():>8,}  →  {df_clean.duplicated().sum():>8,}")


def limpiar_id(serie):
    return serie.astype(str).str.strip().str.lower()


def limpiar_calmonth(serie):
    def parsear(val):
        val = str(val).strip().replace("-", "").replace("/", "")
        if len(val) == 6 and val.isdigit():
            return int(val)
        try:
            return int(pd.to_datetime(val).strftime("%Y%m"))
        except Exception:
            return np.nan
    return serie.apply(parsear)


# ════════════════════════════════════════════════════════
#  BLOQUE 1 — LIMPIEZA
# ════════════════════════════════════════════════════════

def limpiar_clientes():
    df = pd.read_csv(
        f"{INPUT_DIR}/Clientes.csv",
        header=None,
        names=["customer_id", "territory_d", "comercial_subchannel_d", "rtm_customer_size_d"],
        low_memory=False, dtype=str
    )
    raw = df.copy()
    df["customer_id"] = limpiar_id(df["customer_id"])
    for col in ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]:
        df[col] = (df[col].astype(str).str.strip().str.title()
                   .replace({"Nan": "Desconocido", "None": "Desconocido", "": "Desconocido"}))
    df = df.drop_duplicates(subset="customer_id", keep="first")
    df = df.sort_values("customer_id").reset_index(drop=True)
    df.to_csv(f"{OUTPUT_DIR}/Clientes_clean.csv", index=False)
    reporte("Clientes.csv", raw, df)
    return df


def limpiar_coolers():
    df = pd.read_csv(
        f"{INPUT_DIR}/Coolers.csv",
        header=None,
        names=["customer_id", "calmonth", "num_coolers", "num_doors"],
        low_memory=False, dtype=str
    )
    raw = df.copy()
    df = df[df["customer_id"] != "customer_id"].copy()
    df["customer_id"] = limpiar_id(df["customer_id"])
    df["calmonth"]    = limpiar_calmonth(df["calmonth"])
    df = df.dropna(subset=["calmonth"])
    df["calmonth"] = df["calmonth"].astype(int)
    for col in ["num_coolers", "num_doors"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").clip(lower=0).fillna(0).astype(int)
    df = df.drop_duplicates(subset=["customer_id", "calmonth"], keep="last")
    df = df.sort_values(["customer_id", "calmonth"]).reset_index(drop=True)
    df.to_csv(f"{OUTPUT_DIR}/Coolers_clean.csv", index=False)
    reporte("Coolers.csv", raw, df)
    return df


def limpiar_preds():
    df = pd.read_csv(f"{INPUT_DIR}/preds_submission.csv", dtype=str)
    raw = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]
    df = df.drop(columns=[c for c in df.columns if c.startswith("unnamed")])
    df["customer_id"] = limpiar_id(df["customer_id"])
    if "target" in df.columns:
        df["target"] = pd.to_numeric(df["target"], errors="coerce")
        df = df[["customer_id", "target"]]
    else:
        df = df[["customer_id"]]
    df = df.drop_duplicates(subset="customer_id", keep="last")
    df = df.sort_values("customer_id").reset_index(drop=True)
    df.to_csv(f"{OUTPUT_DIR}/preds_submission_clean.csv", index=False)
    reporte("preds_submission.csv", raw, df)
    print("target vacío — se llenará con las predicciones del modelo")
    return df


def limpiar_sales(nombre_archivo, es_train=True):
    cols = ["customer_id", "calmonth", "num_transacciones", "uni_boxes_sold_m"]
    if es_train:
        cols.append("target")
    df = pd.read_csv(
        f"{INPUT_DIR}/{nombre_archivo}",
        header=None, names=cols,
        low_memory=False, dtype=str
    )
    raw = df.copy()
    df = df[df["customer_id"] != "customer_id"].copy()
    df["customer_id"] = limpiar_id(df["customer_id"])
    df["calmonth"]    = limpiar_calmonth(df["calmonth"])
    df = df.dropna(subset=["calmonth"])
    df["calmonth"] = df["calmonth"].astype(int)
    for col in ["num_transacciones", "uni_boxes_sold_m"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").clip(lower=0)
        df[col] = df.groupby("customer_id")[col].transform(
            lambda x: x.fillna(x.median())
        ).fillna(0)
    df["num_transacciones"] = df["num_transacciones"].astype(int)
    if es_train:
        df["target"] = pd.to_numeric(df["target"], errors="coerce").round().clip(0, 1)
        df = df.dropna(subset=["target"])
        df["target"] = df["target"].astype(int)
    df = df.drop_duplicates(subset=["customer_id", "calmonth"], keep="last")
    df = df.sort_values(["customer_id", "calmonth"]).reset_index(drop=True)
    nombre_out = nombre_archivo.replace(".csv", "_clean.csv")
    df.to_csv(f"{OUTPUT_DIR}/{nombre_out}", index=False)
    reporte(nombre_archivo, raw, df)
    return df


# ════════════════════════════════════════════════════════
#  BLOQUE 2 — FEATURE ENGINEERING OPTIMIZADO
#
#  PROBLEMA ORIGINAL:
#    .apply(lambda g: ...) itera cliente por cliente en Python puro.
#    Con 50k+ clientes esto congela la computadora porque cada iteración
#    es un loop, no una operación vectorizada.
#
#  SOLUCIÓN:
#    Reemplazar cada cálculo por operaciones nativas de pandas/numpy
#    que trabajan sobre TODO el dataframe a la vez en C (mucho más rápido).
#
#  COMPARACIÓN DE VELOCIDAD APROXIMADA:
#    .apply() con 100k filas  → ~60-120 segundos
#    versión vectorizada      →  ~1-3 segundos
# ════════════════════════════════════════════════════════

def calcular_tendencia_vectorizado(df_sales):
    """
    Calcula la pendiente de ventas por cliente SIN .apply().

    Truco matemático:
    La pendiente de una regresión lineal simple es:
        slope = (n * Σ(x*y) - Σx * Σy) / (n * Σ(x²) - (Σx)²)
    donde x = posición temporal (0, 1, 2, ...) e y = cajas vendidas.

    Calculamos todas esas sumas de golpe con groupby vectorizado.
    """
    # Asignar posición temporal por cliente (0, 1, 2, ...)
    df = df_sales.sort_values(["customer_id", "calmonth"]).copy()
    df["t"] = df.groupby("customer_id").cumcount()  # 0, 1, 2, ... por cliente

    y = df["uni_boxes_sold_m"]
    t = df["t"]

    # Todas las sumas necesarias para la fórmula, agrupadas por cliente
    grp = df.groupby("customer_id")
    n     = grp["t"].count()
    sum_t = grp["t"].sum()
    sum_y = grp[y.name].sum()
    sum_ty = (t * y).groupby(df["customer_id"]).sum()
    sum_t2 = (t * t).groupby(df["customer_id"]).sum()

    denominador = n * sum_t2 - sum_t ** 2
    # Evitar división por cero (clientes con un solo mes)
    tendencia = np.where(
        denominador != 0,
        (n * sum_ty - sum_t * sum_y) / denominador,
        0.0
    )

    return pd.Series(tendencia, index=n.index, name="tendencia_cajas")

def generar_meses_entre(min_mes, max_mes):
    """Generates valid YYYYMM months between two dates."""
    meses = []
    year  = min_mes // 100
    month = min_mes % 100
    while True:
        meses.append(year * 100 + month)
        if year * 100 + month == max_mes:
            break
        month += 1
        if month > 12:
            month = 1
            year += 1
    return meses


def rellenar_meses_faltantes(df_sales):
    """Fills missing months with 0 between each customer's first and last month."""
    min_mes = df_sales["calmonth"].min()
    max_mes = df_sales["calmonth"].max()

    todos_los_meses = generar_meses_entre(min_mes, max_mes)
    todos_clientes  = df_sales["customer_id"].unique()

    indice_completo = pd.MultiIndex.from_product(
        [todos_clientes, todos_los_meses],
        names=["customer_id", "calmonth"]
    )

    # Columns to fill with 0 when missing
    cols_numericas = ["num_transacciones", "uni_boxes_sold_m"]
    if "target" in df_sales.columns:
        cols_a_rellenar = cols_numericas  # don't fill target with 0
    else:
        cols_a_rellenar = cols_numericas

    df_completo = (
        df_sales
        .set_index(["customer_id", "calmonth"])[cols_a_rellenar]
        .reindex(indice_completo, fill_value=0)
        .reset_index()
    )

    # Re-attach target using the original data (not filled)
    if "target" in df_sales.columns:
        target_original = df_sales[["customer_id", "calmonth", "target"]]
        df_completo = df_completo.merge(
            target_original, on=["customer_id", "calmonth"], how="left"
        )

    return df_completo

def features_sales(df_sales, fecha_referencia=None):
    """
    Versión OPTIMIZADA: todo vectorizado con groupby nativo de pandas.
    Sin .apply(), sin loops en Python.
    """
    if fecha_referencia is None:
        fecha_referencia = df_sales["calmonth"].max()

    grp = df_sales.groupby("customer_id")

    # ── Features simples: una operación por feature ──────────────────
    meses_activo           = grp["calmonth"].count().rename("meses_activo")
    promedio_transacciones = grp["num_transacciones"].mean().rename("promedio_transacciones")
    std_transacciones      = grp["num_transacciones"].std(ddof=0).fillna(0).rename("std_transacciones")
    max_transacciones      = grp["num_transacciones"].max().rename("max_transacciones")
    promedio_cajas         = grp["uni_boxes_sold_m"].mean().rename("promedio_cajas")
    max_cajas              = grp["uni_boxes_sold_m"].max().rename("max_cajas")
    min_cajas              = grp["uni_boxes_sold_m"].min().rename("min_cajas")
    ultimo_calmonth        = grp["calmonth"].max().rename("ultimo_calmonth")

    # ── meses_sin_comprar: requiere filtrar filas con compras reales ──
    # Solo filas donde hubo al menos una transacción
    con_compras = df_sales[df_sales["num_transacciones"] > 0]

    if len(con_compras) > 0:
        ultimo_mes_con_compra = (
            con_compras.groupby("customer_id")["calmonth"]
            .max()
            .rename("ultimo_mes_con_compra")
        )
    else:
        ultimo_mes_con_compra = pd.Series(dtype=int, name="ultimo_mes_con_compra")

    # Calcular diferencia respecto a fecha_referencia
    # Clientes sin ninguna compra reciben 99
    meses_sin_comprar = (fecha_referencia - ultimo_mes_con_compra).rename("meses_sin_comprar")

    # ── Tendencia vectorizada ─────────────────────────────────────────
    tendencia_cajas = calcular_tendencia_vectorizado(df_sales)

    # ── Unir todo en una sola tabla ───────────────────────────────────
    agg = pd.concat([
        meses_activo,
        promedio_transacciones,
        std_transacciones,
        max_transacciones,
        promedio_cajas,
        max_cajas,
        min_cajas,
        tendencia_cajas,
        ultimo_calmonth,
    ], axis=1).reset_index()

    # Merge con meses_sin_comprar (puede haber clientes sin compras)
    agg = agg.merge(
        meses_sin_comprar.reset_index(),
        on="customer_id", how="left"
    )
    agg["meses_sin_comprar"] = agg["meses_sin_comprar"].fillna(99)

    return agg


def features_coolers(df_coolers):
    """Sin cambios — ya era eficiente."""
    df_sorted = df_coolers.sort_values(["customer_id", "calmonth"])
    reciente  = df_sorted.groupby("customer_id").last().reset_index()
    reciente  = reciente.rename(columns={
        "num_coolers": "num_coolers_reciente",
        "num_doors"  : "num_doors_reciente"
    })[["customer_id", "num_coolers_reciente", "num_doors_reciente"]]
    return reciente


def construir_tabla_modelo(df_sales, df_clientes, df_coolers, es_train=True, fecha_referencia=None):
    print("\n  🔧 Rellenando meses faltantes con 0...")
    df_sales = rellenar_meses_faltantes(df_sales) # 0 month 

    print("  🔧 Calculando features de ventas (vectorizado)...")
    feats_sales = features_sales(df_sales, fecha_referencia=fecha_referencia)

    print("  🔧 Extrayendo features de coolers...")
    feats_coolers = features_coolers(df_coolers)

    print("  🔧 Haciendo merge con clientes...")
    tabla = feats_sales.merge(feats_coolers, on="customer_id", how="left")
    tabla = tabla.merge(
        df_clientes[["customer_id", "territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]],
        on="customer_id", how="left"
    )

    tabla["num_coolers_reciente"] = tabla["num_coolers_reciente"].fillna(0)
    tabla["num_doors_reciente"]   = tabla["num_doors_reciente"].fillna(0)

    for col in ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]:
        tabla[col] = tabla[col].fillna("Desconocido")

    if es_train:
        target = df_sales.groupby("customer_id")["target"].last().reset_index()
        tabla  = tabla.merge(target, on="customer_id", how="left")
        tabla  = tabla.dropna(subset=["target"])
        tabla["target"] = tabla["target"].astype(int)

    print(f"  ✅ Tabla construida: {tabla.shape[0]:,} clientes × {tabla.shape[1]} columnas")
    return tabla


# ════════════════════════════════════════════════════════
#  BLOQUE 3 — ENCODING + ENTRENAMIENTO XGBOOST
# ════════════════════════════════════════════════════════

COLS_CATEGORICAS = ["territory_d", "comercial_subchannel_d", "rtm_customer_size_d"]

def encodear(df_train, df_test=None):
    mappings = {}
    for col in COLS_CATEGORICAS:
        categorias = sorted(df_train[col].unique())
        mapping    = {cat: i for i, cat in enumerate(categorias)}
        mappings[col] = mapping
        df_train[col] = df_train[col].map(mapping).fillna(-1).astype(int)
        if df_test is not None:
            df_test[col] = df_test[col].map(mapping).fillna(-1).astype(int)
    return df_train, df_test, mappings


def entrenar_xgboost(tabla_train):
    print("\n  🤖 Preparando datos para XGBoost...")

    FEATURES = [
        "meses_activo", "meses_sin_comprar",
        "promedio_transacciones", "std_transacciones", "max_transacciones",
        "promedio_cajas", "max_cajas", "min_cajas", "tendencia_cajas",
        "ultimo_calmonth",
        "num_coolers_reciente", "num_doors_reciente",
        "territory_d", "comercial_subchannel_d", "rtm_customer_size_d"
    ]

    X = tabla_train[FEATURES]
    y = tabla_train["target"]

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    n_neg  = (y_train == 0).sum()
    n_pos  = (y_train == 1).sum()
    scale  = n_neg / n_pos if n_pos > 0 else 1
    print(f"  📊 Sin churn: {n_neg:,} | Con churn: {n_pos:,} | scale_pos_weight: {scale:.1f}")

    modelo = XGBClassifier(
        n_estimators      = 300,
        max_depth         = 6,
        learning_rate     = 0.05,
        subsample         = 0.8,
        colsample_bytree  = 0.8,
        scale_pos_weight  = scale,
        eval_metric       = "auc",
        random_state      = 42,
        n_jobs            = -1
    )

    print("  🚀 Entrenando XGBoost...")
    modelo.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=50
    )

    y_prob = modelo.predict_proba(X_val)[:, 1]
    y_pred = modelo.predict(X_val)
    auc    = roc_auc_score(y_val, y_prob)

    print(f"\n{'─'*52}")
    print(f"  📈 ROC-AUC en validación: {auc:.4f}")
    print(f"{'─'*52}")
    print(classification_report(y_val, y_pred, target_names=["No churn", "Churn"]))

    importancias = pd.Series(modelo.feature_importances_, index=FEATURES)
    importancias = importancias.sort_values(ascending=False)
    print("  🔍 Top 5 features más importantes:")
    for feat, val in importancias.head(5).items():
        print(f"     {feat:<30} {val:.4f}")

    joblib.dump(modelo, f"{MODEL_DIR}/xgboost_churn.pkl")
    importancias.to_csv(f"{MODEL_DIR}/feature_importance.csv", header=["importancia"])
    print(f"\n  💾 Modelo guardado en: {MODEL_DIR}/xgboost_churn.pkl")

    return modelo, FEATURES


def generar_predicciones(modelo, tabla_test, df_preds, features):
    print("\n  🔮 Generando predicciones para test...")

    X_test = tabla_test[features]
    probs  = modelo.predict_proba(X_test)[:, 1]

    resultado = tabla_test[["customer_id"]].copy()
    resultado["target"] = probs

    resultado["riesgo"] = pd.cut(
        resultado["target"],
        bins=[-0.001, 0.33, 0.66, 1.001],
        labels=["Bajo", "Medio", "Alto"]
    )

    df_preds_out = df_preds[["customer_id"]].merge(
        resultado[["customer_id", "target", "riesgo"]],
        on="customer_id", how="left"
    )

    df_preds_out = df_preds_out.sort_values("target", ascending=False).reset_index(drop=True)
    df_preds_out.to_csv(f"{MODEL_DIR}/preds_submission_final.csv", index=False)

    dist = resultado["riesgo"].value_counts()
    print(f"\n  📊 Distribución de riesgo:")
    for nivel in ["Alto", "Medio", "Bajo"]:
        n   = dist.get(nivel, 0)
        pct = n / len(resultado) * 100
        print(f"     {nivel:<8}: {n:>7,}  ({pct:.1f}%)")

    print(f"\n  💾 Predicciones guardadas en: {MODEL_DIR}/preds_submission_final.csv")
    return df_preds_out


# ════════════════════════════════════════════════════════
#  EJECUTAR PIPELINE COMPLETO
# ════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n🔍 CHURN HUNTERS — Pipeline optimizado\n")

    print("=" * 52)
    print("  BLOQUE 1 — LIMPIEZA")
    print("=" * 52)

    clientes = limpiar_clientes()
    coolers  = limpiar_coolers()
    preds    = limpiar_preds()
    train    = limpiar_sales("sales_churn_train.csv", es_train=True)
    test     = limpiar_sales("sales_churn_test.csv",  es_train=False)

    print("\n" + "=" * 52)
    print("  BLOQUE 2 — MERGE Y FEATURE ENGINEERING")
    print("=" * 52)

    fecha_ref_train = train["calmonth"].max()
    print(f"\n  Fecha de referencia para features: {fecha_ref_train}")

    tabla_train = construir_tabla_modelo(
        train, clientes, coolers,
        es_train=True, fecha_referencia=fecha_ref_train
    )

    clientes_test  = set(test["customer_id"].unique())
    clientes_train = set(train["customer_id"].unique())

    train_para_test = train[train["customer_id"].isin(clientes_test)].copy()
    clientes_nuevos = clientes_test - clientes_train
    test_nuevos     = test[test["customer_id"].isin(clientes_nuevos)].copy()
    historial_test  = pd.concat([train_para_test, test_nuevos], ignore_index=True)

    print(f"  Clientes test con historial en train: {len(clientes_test) - len(clientes_nuevos):,}")
    print(f"  Clientes test nuevos (solo 202602):   {len(clientes_nuevos):,}")

    tabla_test = construir_tabla_modelo(
        historial_test, clientes, coolers,
        es_train=False, fecha_referencia=fecha_ref_train
    )

    print("\n  🔧 Encoding de variables categóricas...")
    tabla_train, tabla_test, _ = encodear(tabla_train, tabla_test)

    tabla_train.to_csv(f"{MODEL_DIR}/tabla_train_final.csv", index=False)
    tabla_test.to_csv(f"{MODEL_DIR}/tabla_test_final.csv",   index=False)

    print("\n" + "=" * 52)
    print("  BLOQUE 3 — ENTRENAMIENTO XGBOOST")
    print("=" * 52)

    modelo, features = entrenar_xgboost(tabla_train)

    print("\n" + "=" * 52)
    print("  BLOQUE 4 — PREDICCIONES")
    print("=" * 52)

    generar_predicciones(modelo, tabla_test, preds, features)

    print("\n✅ Pipeline completo. Outputs en:")
    print(f"   clean/   → CSVs limpios")
    print(f"   modelo/  → modelo, features, predicciones\n")
