# DyR


# Churn Hunters — Anticipándonos al abandono de clientes

Pipeline de ML para predecir qué clientes B2B están en riesgo de abandono, con explicaciones en lenguaje natural por cliente.

---

## Datos

Los datos no se incluyen en el repo por su tamaño.

**Descargar y descomprimir en la raíz del proyecto:**
https://drive.google.com/drive/folders/1ChdwioLOkDYRCDSg438V4PGLimtaeobQ?usp=sharing

| Archivo | Descripción |
|---|---|
| `Clientes.csv` | Perfil del cliente (territorio, canal, tamaño) |
| `Coolers.csv` | Estado del equipo frío por mes |
| `sales_churn_train.csv` | Historial de ventas con etiqueta de churn |
| `sales_churn_test.csv` | Clientes a predecir  |
| `preds_submission.csv` | Template de entrega |

---

## Uso

```bash

pip install -r requirements.txt

# Paso 1: limpieza + feature engineering + XGBoost + predicciones
python limpieza_datos.py

# Paso 2: explicaciones SHAP por cliente
python limpieza2.py
```

**Outputs en `modelo/`:**
- `preds_submission_final.csv` — probabilidad de churn + etiqueta Alto/Medio/Bajo
- `explicaciones_clientes.csv` — top 3 razones en lenguaje natural por cliente

---

##  .gitignore

```
Data - Churn Hunters/
*.csv
*.xlsx
*.zip
*.parquet
*.pkl
*.joblib
```




