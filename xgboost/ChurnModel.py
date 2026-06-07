import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import os

# Configuraciones de rutas
CLEAN_DIR = "limpieza-polaris/clean"
MODEL_DIR = "modelo"
os.makedirs(MODEL_DIR, exist_ok=True)

print("📖 1. Cargando datos consolidados creados por Polars...")
df_master = pd.read_csv(f"{CLEAN_DIR}/train_consolidado.csv")
df_submission_raw = pd.read_csv(f"{CLEAN_DIR}/test_consolidado.csv")

# ==========================================
# 1. CODIFICACIÓN SEGURA DE VARIABLES CATEGÓRICAS
# ==========================================
print("🏷️ 2. Codificando variables categóricas de texto...")
cat_cols = ['territory_d', 'comercial_subchannel_d', 'rtm_customer_size_d']

for col in cat_cols:
    le = LabelEncoder()
    full_cats = pd.concat([df_master[col], df_submission_raw[col]]).astype(str)
    le.fit(full_cats)
    df_master[col] = le.transform(df_master[col].astype(str))
    df_submission_raw[col] = le.transform(df_submission_raw[col].astype(str))

# ==========================================
# 2. SEPARACIÓN DE DATOS PARA VALIDACIÓN LOCAL REAL
# ==========================================
features = [
    'meses_activo', 'promedio_transacciones', 'std_transacciones', 
    'max_transacciones', 'promedio_cajas', 'max_cajas', 'min_cajas', 
    'tendencia_cajas', 'num_coolers_reciente', 'num_doors_reciente',
    'territory_d', 'comercial_subchannel_d', 'rtm_customer_size_d'
]

X_completo = df_master[features]
y_completo = df_master['target']

# Separamos un 20% del train para simular un examen con unos y ceros conocidos
X_train, X_val, y_train, y_val = train_test_split(
    X_completo, y_completo, test_size=0.20, stratify=y_completo, random_state=42
)

# ==========================================
# 3. BALANCEO DE CLASES Y CONFIGURACIÓN DE XGBOOST
# ==========================================
print("🤖 3. Calculando el ratio de desbalanceo de Churn...")
negativos = (y_train == 0).sum()
positivos = (y_train == 1).sum()
ratio_desbalance = negativos / positivos if positivos > 0 else 1

print(f"   ↳ Clientes Activos en Train Local (0): {negativos}")
print(f"   ↳ Clientes en Churn en Train Local (1): {positivos}")
print(f"   ↳ Clientes en Churn en Validación Local (1): {(y_val == 1).sum()} ← ¡Métricas listas!")

print("\n🚀 4. Iniciando el entrenamiento del modelo robusto XGBoost...")
modelo_xgb = xgb.XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=ratio_desbalance,
    eval_metric='auc',
    random_state=42,
    n_jobs=-1
)

# Ajuste usando el bloque de validación local
modelo_xgb.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    verbose=50
)

# ==========================================
# 4. DIAGNÓSTICO METROLÓGICO (PANTALLA)
# ==========================================
print("\n📊 --- 5. EVALUACIÓN DE RENDIMIENTO CON VALIDACIÓN LOCAL ---")
preds_val = modelo_xgb.predict(X_val)
preds_proba_val = modelo_xgb.predict_proba(X_val)[:, 1]

auc_score = roc_auc_score(y_val, preds_proba_val)
print(f"🥇 ROC AUC Score Verdadero: {auc_score:.4f}")

print("\n📋 Reporte de Clasificación Extendido:")
print(classification_report(y_val, preds_val))

print("🪟 Matriz de Confusión:")
cm = confusion_matrix(y_val, preds_val)
print(f"   [ [Verdaderos Activos: {cm[0][0]}, Falsos Churn: {cm[0][1]}],")
print(f"     [Falsos Activos: {cm[1][0]}, Verdaderos Churn: {cm[1][1]}] ]")

# ==========================================
# 5. GENERACIÓN DE PREDICCIONES Y CRUCE EN TU PLANTILLA
# ==========================================
print("\n🔮 6. Generando predicciones finales para el set de evaluación a ciegas...")
X_submission = df_submission_raw[features]
preds_proba_sub = modelo_xgb.predict_proba(X_submission)[:, 1]
preds_final_sub = modelo_xgb.predict(X_submission)

# DataFrame temporal con los resultados correlacionados por ID limpio
df_resultados = pd.DataFrame({
    'customer_id': df_submission_raw['customer_id'].astype(str).str.strip().str.lower(),
    'probabilidad_churn': preds_proba_sub,
    'prediccion_final': preds_final_sub
})

print("📂 7. Guardando resultados directamente en tu plantilla 'preds_submission.csv'...")
if os.path.exists("preds_submission.csv"):
    df_plantilla = pd.read_csv("preds_submission.csv")
    
    # Estandarizamos los IDs de tu plantilla para asegurar que se crucen bien
    col_id_plantilla = 'customer_id' 
    df_plantilla[col_id_plantilla] = df_plantilla[col_id_plantilla].astype(str).str.strip().str.lower()
    
    # Limpiamos columnas de predicciones previas si es que existen
    for col in ['probabilidad_churn', 'prediccion_final', 'target']:
        if col in df_plantilla.columns:
            df_plantilla = df_plantilla.drop(columns=[col])
            
    # Hacemos un merge para inyectar los datos respetando el orden original de tu plantilla
    df_entregable_final = df_plantilla.merge(df_resultados, on=col_id_plantilla, how='left')
    
    # Rellenos preventivos por seguridad
    df_entregable_final['probabilidad_churn'] = df_entregable_final['probabilidad_churn'].fillna(0.0)
    df_entregable_final['prediccion_final'] = df_entregable_final['prediccion_final'].fillna(0).astype(int)
    
    # Guardamos los cambios sobreescribiendo el archivo
    df_entregable_final.to_csv("preds_submission.csv", index=False)
    print(f"\n✅ ¡Todo listo! Los resultados se guardaron directamente en 'preds_submission.csv'")
else:
    print("\n❌ Error: No se encontró el archivo 'preds_submission.csv' en esta carpeta.")