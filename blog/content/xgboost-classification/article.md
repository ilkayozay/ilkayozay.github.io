# Giriş

XGBoost (eXtreme Gradient Boosting), günümüzde en popüler ve başarılı makine öğrenimi algoritmalarından biridir. Gradient Boosting yaklaşımının optimize edilmiş bir uygulamasıdır ve özellikle doğruluk, hız ve esneklik dengesiyle öne çıkar.

XGBoost hem sınıflandırma hem de regresyon problemlerinde kullanılabilir. Temelde çok sayıda zayıf öğreniciyi, çoğu zaman karar ağaçlarını, daha güçlü bir model üretmek için bir araya getirir.

## XGBoost alt sınıfları

- `XGBClassifier`: sınıflandırma problemleri için
- `XGBRFClassifier`: rastgele orman yaklaşımıyla sınıflandırma için
- `XGBRegressor`: regresyon problemleri için
- `XGBRFRegressor`: rastgele orman yaklaşımıyla regresyon için
- `XGBRanker`: sıralama problemleri için

Bu yazıda odak nokta sınıflandırma senaryosudur.

## Wine veri kümesi

Örneklerde `Wine Dataset` kullanılmaktadır. Bu veri kümesi UCI Machine Learning Repository'de yer alır ve üç üzüm çeşidine ait 178 örnek içerir. Toplam 13 özellik vardır ve hedef değişken, örneğin hangi üzüm sınıfına ait olduğunu belirtir.

Veri kümesinin temel özellikleri:

1. Alcohol
2. Malic acid
3. Ash
4. Alcalinity of ash
5. Magnesium
6. Total phenols
7. Flavanoids
8. Nonflavanoid phenols
9. Proanthocyanins
10. Color intensity
11. Hue
12. OD280/OD315 of diluted wines
13. Proline

## Veri çerçevesi oluşturma

```python
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.utils import shuffle

wine = load_wine()

wine_df = pd.DataFrame(wine.data, columns=wine.feature_names)
wine_df['target'] = wine.target

wine_df = shuffle(wine_df, random_state=42)
wine_df.reset_index(drop=True, inplace=True)

wine_df.head()
```

![Wine veri kümesinin ilk satırları](wine_data_head.JPG)

Veri dağılımını görselleştirmek için Seaborn ve Matplotlib birlikte kullanılabilir:

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.datasets import load_wine

wine = load_wine()
wine_df = pd.DataFrame(wine.data, columns=wine.feature_names)
wine_df['target'] = wine.target

class_counts = wine_df['target'].value_counts().sort_index()

fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(14, 6))
palette = sns.color_palette("magma", 3)

axes[0].pie(class_counts, autopct="%.1f%%", startangle=90, colors=palette)
axes[0].set_title("Wine Target Distribution - Pie Chart")
axes[0].set_ylabel("")
axes[0].legend(class_counts.index)

sns.countplot(x='target', data=wine_df, palette=palette, ax=axes[1])
axes[1].set_title("Wine Target Distribution - Bar Chart")
axes[1].set_xlabel("")
axes[1].set_ylabel("Count")

plt.show()
```

![Wine veri kümesi sınıf dağılımı](wine_data_gorsel.JPG)

## XGBClassifier kullanımı

`XGBClassifier`, XGBoost'un sınıflandırma için kullanılan ana sınıfıdır. Varsayılan parametreler çoğu zaman iyi bir başlangıç verir, fakat gerçek projelerde `learning_rate`, `n_estimators`, `max_depth`, `subsample` ve `colsample_bytree` gibi parametreler üzerinde ayar yapmak gerekir.

Sık kullanılan bazı parametreler:

- `learning_rate`
- `n_estimators`
- `max_depth`
- `min_child_weight`
- `gamma`
- `subsample`
- `colsample_bytree`
- `objective`
- `random_state`

## Model oluşturma ve değerlendirme

Bu senaryoda veri setinin `%80`'i eğitim, `%20`'si test için ayrılır.

```python
import xgboost as xgb
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

wine = load_wine()
X = wine.data
y = wine.target

X_train, X_test, y_train, y_test = train_test_split(
	X,
	y,
	test_size=0.2,
	random_state=42,
	stratify=y
)

model = xgb.XGBClassifier(
	n_estimators=200,
	max_depth=4,
	learning_rate=0.05,
	subsample=0.9,
	colsample_bytree=0.9,
	eval_metric='mlogloss'
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

## KNN ile kısa karşılaştırma

Eski HTML sürümünde XGBoost ile birlikte K-Nearest Neighbors görsel bir karşılaştırma da bulunuyordu. Aynı görseli taşımak için aşağıdaki görsel korunmuştur:

![KNN karşılaştırma görseli](K-Nearest_Neighbors_pic1.png)

## Not

Eski yapıda `xgboost_ek1.html` ayrı bir yardımcı sayfa olarak kullanılıyordu. İçindeki görsel artık bu makale içine taşındığı için ayrı sayfaya ihtiyaç kalmadı.
