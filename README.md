# DyR
[Enlace de Google Drive](https://drive.google.com/file/d/1kqFJb_rX1nq7G-TVnFEgnPcXvKUt3bP0/view?usp=sharing)

# Churn Hunters — Anticipándonos al abandono de clientes
Pipeline de ML para predecir qué clientes B2B están en riesgo de abandono antes de que ocurra, y explicar en lenguaje natural las razones detrás de cada predicción. Genera una probabilidad de churn por cliente, una etiqueta de riesgo (Alto/Medio/Bajo) y las 3 principales razones de riesgo listas para el dashboard del vendedor.

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
| `sales_churn_test.csv` | Clientes a predecir |
| `preds_submission.csv` | Template de entrega |

---
## Uso
```bash
pip install -r requirements.txt

# Paso 1: limpieza + feature engineering + XGBoost + predicciones
python limpieza_datos.py

# Paso 2: explicaciones SHAP por cliente
python limpieza2.py