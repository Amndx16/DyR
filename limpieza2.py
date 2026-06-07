"""
CHURN HUNTERS — Explicabilidad con SHAP
Genera para cada cliente las razones de su prediccion en lenguaje natural.
Output: modelo/explicaciones_clientes.csv
"""

import pandas as pd
import numpy as np
import joblib
import shap

# ══════════════════════════════════════════════
#  CONFIGURACION
# ══════════════════════════════════════════════

FEATURES = [
    'meses_activo', 'meses_sin_comprar',
    'promedio_transacciones', 'std_transacciones', 'max_transacciones',
    'promedio_cajas', 'max_cajas', 'min_cajas', 'tendencia_cajas',
    'ultimo_calmonth', 'num_coolers_reciente', 'num_doors_reciente',
    'territory_d', 'comercial_subchannel_d', 'rtm_customer_size_d'
]

# ══════════════════════════════════════════════
#  CARGAR MODELO Y DATOS
# ══════════════════════════════════════════════
print("Cargando modelo y datos...")

modelo     = joblib.load("modelo/xgboost_churn.pkl")
tabla_test = pd.read_csv("modelo/tabla_test_final.csv")
preds      = pd.read_csv("modelo/preds_submission_final.csv")

X_test = tabla_test[FEATURES]

# ══════════════════════════════════════════════
#  CALCULAR SHAP VALUES
# ══════════════════════════════════════════════
print("Calculando SHAP values (puede tardar unos minutos)...")

explainer   = shap.TreeExplainer(modelo)
shap_values = explainer.shap_values(X_test)

# shap_values tiene forma (n_clientes, n_features)
# valor positivo = empuja hacia churn
# valor negativo = empuja hacia no churn
shap_df = pd.DataFrame(shap_values, columns=FEATURES)

# ══════════════════════════════════════════════
#  TRADUCIR SHAP A LENGUAJE NATURAL
# ══════════════════════════════════════════════

def explicar_feature(feature, valor_shap, valor_real):
    """
    Convierte un feature + su SHAP value en una frase legible
    para el vendedor o el dashboard.
    """
    sube_riesgo = valor_shap > 0

    if feature == "meses_sin_comprar":
        if sube_riesgo:
            return f"Lleva {int(valor_real)} meses sin pedir"
        else:
            return f"Compro hace solo {int(valor_real)} mes(es)"

    elif feature == "tendencia_cajas":
        if sube_riesgo:
            return f"Sus pedidos van a la baja ({valor_real:.1f} cajas/mes de tendencia)"
        else:
            return f"Sus pedidos van al alza ({valor_real:.1f} cajas/mes de tendencia)"

    elif feature == "min_cajas":
        if sube_riesgo:
            return f"Su pedido minimo historico es muy bajo ({valor_real:.0f} cajas)"
        else:
            return f"Mantiene un piso solido de compras ({valor_real:.0f} cajas minimo)"

    elif feature == "promedio_transacciones":
        if sube_riesgo:
            return f"Frecuencia de compra baja (promedio {valor_real:.1f} transacciones/mes)"
        else:
            return f"Compra con frecuencia ({valor_real:.1f} transacciones/mes en promedio)"

    elif feature == "meses_activo":
        if sube_riesgo:
            return f"Cliente con poco historial ({int(valor_real)} meses)"
        else:
            return f"Cliente consolidado ({int(valor_real)} meses activo)"

    elif feature == "num_coolers_reciente":
        if sube_riesgo:
            return f"Tiene pocos coolers activos ({int(valor_real)})"
        else:
            return f"Buena presencia de coolers ({int(valor_real)} unidades)"

    elif feature == "max_transacciones":
        if sube_riesgo:
            return f"Su mejor mes fue de solo {int(valor_real)} transacciones"
        else:
            return f"Ha tenido meses de hasta {int(valor_real)} transacciones"

    elif feature == "std_transacciones":
        if sube_riesgo:
            return f"Compras muy irregulares (variacion de {valor_real:.1f})"
        else:
            return f"Patron de compra estable"

    elif feature == "promedio_cajas":
        if sube_riesgo:
            return f"Volumen promedio bajo ({valor_real:.0f} cajas/mes)"
        else:
            return f"Buen volumen promedio ({valor_real:.0f} cajas/mes)"

    elif feature == "territory_d":
        if sube_riesgo:
            return "Zona con alta tasa de abandono historica"
        else:
            return "Zona con buena retencion historica"

    elif feature == "rtm_customer_size_d":
        if sube_riesgo:
            return f"Segmento {valor_real} con mayor riesgo en esta zona"
        else:
            return f"Segmento {valor_real} con buen desempeno"

    else:
        if sube_riesgo:
            return f"{feature} indica riesgo"
        else:
            return f"{feature} indica estabilidad"


def top3_razones(idx, shap_row, X_row):
    """
    Toma las 3 features con mayor valor absoluto de SHAP
    y genera frases en lenguaje natural.
    """
    importancias = shap_row.abs().sort_values(ascending=False)
    top3         = importancias.head(3).index.tolist()

    razones = []
    for feat in top3:
        frase = explicar_feature(feat, shap_row[feat], X_row[feat])
        razones.append(frase)

    return razones


# ══════════════════════════════════════════════
#  GENERAR TABLA DE EXPLICACIONES
# ══════════════════════════════════════════════
print("Generando explicaciones por cliente...")

registros = []
for i in range(len(tabla_test)):
    shap_row = shap_df.iloc[i]
    X_row    = X_test.iloc[i]
    razones  = top3_razones(i, shap_row, X_row)

    registros.append({
        "customer_id": tabla_test.iloc[i]["customer_id"],
        "razon_1"    : razones[0],
        "razon_2"    : razones[1],
        "razon_3"    : razones[2],
    })

explicaciones = pd.DataFrame(registros)

# Merge con predicciones para tener todo junto
resultado = preds[["customer_id", "target", "riesgo"]].merge(
    explicaciones, on="customer_id", how="left"
)

resultado = resultado.sort_values("target", ascending=False).reset_index(drop=True)
resultado.to_csv("modelo/explicaciones_clientes.csv", index=False)

# ══════════════════════════════════════════════
#  PREVIEW
# ══════════════════════════════════════════════
print("\n--- PREVIEW: clientes con mayor riesgo ---\n")
pd.set_option("display.max_colwidth", 50)
print(resultado[["customer_id", "riesgo", "target", "razon_1", "razon_2", "razon_3"]]
      .head(10).to_string(index=False))

print(f"\nExplicaciones guardadas en: modelo/explicaciones_clientes.csv")
print(f"Total clientes: {len(resultado):,}")