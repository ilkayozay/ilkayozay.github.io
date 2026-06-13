# Lazy Predict

`Lazy Predict`, verilen veri kümesi üzerinde birçok makine öğrenimi algoritmasını hızlıca deneyip sonuçları tablo halinde göstermeyi amaçlayan pratik bir Python kütüphanesidir.

Özellikle şu durumlarda faydalıdır:

- Hangi modelin iyi bir başlangıç vereceğini hızlıca görmek
- İlk kaba kıyaslamayı uzun deneme-yanılma sürecine girmeden yapmak
- Daha sonra detaylı hiperparametre optimizasyonuna geçmeden önce bir ön eleme yapmak

## Kurulum

```bash
pip install lazypredict
```

## Basit kullanım örneği

```python
from lazypredict.Supervised import LazyClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

data = load_digits()
X = data.data
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=.3,
    random_state=12
)

clf = LazyClassifier(verbose=0, ignore_warnings=True, custom_metric=None)
models, predictions = clf.fit(X_train, X_test, y_train, y_test)

print(models)
```

Bu yaklaşım, çok sayıda sınıflandırma modelini aynı veri üzerinde kıyaslamanıza imkan verir. Eski HTML versiyonunda `ExtraTreesClassifier`, `SVC`, `RandomForestClassifier` ve `LGBMClassifier` gibi modellerin üst sıralarda yer aldığı bir çıktı paylaşılmıştı.

## Sonucu tek modelle doğrulama

Lazy Predict ile çıkan sonucu, belirli bir modeli ayrı çalıştırarak kontrol etmek yararlıdır. Eski içerikte bu kontrol `KNeighborsClassifier` ile yapılıyordu.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

digits = load_digits()

X = digits.data
y = digits.target

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=12
)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

y_pred = knn.predict(X_test)
accuracy = knn.score(X_test, y_test)

print("Doğruluk Oranı:", accuracy)
```

Beklenen çıktı:

```text
Doğruluk Oranı: 0.9851851851851852
```

## Sınırlar

`Lazy Predict` her zaman nihai çözüm değildir.

- Veri kümesi çok büyükse çalışma süresi uzar.
- Çok yüksek boyutlu veride tüm modelleri aynı anda denemek maliyetli olabilir.
- Üretim seviyesinde yine özel model seçimi ve hiperparametre optimizasyonu gerekir.

Bu yüzden yaklaşım genelde şöyledir:

1. `Lazy Predict` ile hızlı ön tarama yap
2. En iyi birkaç modeli seç
3. Bu modeller üzerinde ayrı eğitim, validasyon ve ince ayar yap

## Büyük veri senaryoları

Eski HTML içerikte Fashion-MNIST gibi daha büyük veri setlerinde tüm modeller yerine belirli modellerin ölçülmesinin daha mantıklı olduğu vurgulanıyordu. Bu durumda `LazyClassifier` içindeki model listesini sınırlamak, deneme süresini ciddi biçimde azaltır.