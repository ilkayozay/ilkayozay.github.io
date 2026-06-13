# Veri Ön İşleme: Standardizasyon ve Normalizasyon

Makine öğrenmesi ve veri bilimi projelerinde sıkça karşılaştığımız bir durum var. Elimizdeki veri setinde farklı ölçeklerde değerler bulunuyor. Diyelim ki bir ev fiyat tahmin modeli geliştiriyorsunuz. Evin metrekaresi 100-200 aralığında değerler alırken, fiyatı milyonlar mertebesinde. İşte tam da burada standardizasyon ve normalizasyon devreye giriyor.

## Standardizasyon ve Normalizasyon Nedir?

Bu iki terim sıkça birbirine karıştırılıyor. Hatta bazen birbiri yerine kullanıldığını görüyorum. Ancak aslında farklı şeylerden bahsediyoruz.

Standardizasyon, veriyi ortalama (mean) etrafında yeniden ölçeklendiriyor. Yani verinin ortalamasını 0'a, standart sapmasını 1'e çekiyor. Normalizasyon ise veriyi belirli bir aralığa (genellikle 0-1) sıkıştırıyor.

Şöyle düşünelim: Standardizasyon verideki aykırı değerlere karşı daha dayanıklı. Çünkü standart sapmayı kullanıyor. Normalizasyon ise min-max değerlerini kullanıyor, dolayısıyla aykırı değerlerden daha fazla etkileniyor.

## Python ile Basit Bir Örnek

Hemen bir örnek üzerinden görelim:

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import numpy as np
import pandas as pd

# Örnek veri seti yaratalım
data = {
    'metrekare': [120, 150, 80, 200, 160],
    'fiyat': [1500000, 2000000, 800000, 3000000, 2200000]
}
df = pd.DataFrame(data)

# Standardizasyon
scaler = StandardScaler()
df_scaled = pd.DataFrame(
    scaler.fit_transform(df),
    columns=df.columns
)

# Normalizasyon
normalizer = MinMaxScaler()
df_normalized = pd.DataFrame(
    normalizer.fit_transform(df),
    columns=df.columns
)

print("Orijinal veri:")
print(df.head())
print("\nStandardize edilmiş veri:")
print(df_scaled.head())
print("\nNormalize edilmiş veri:")
print(df_normalized.head())
```

## Ne Zaman Hangisini Kullanmalı?

İşte asıl soru bu. Genellikle şu durumlar belirleyici oluyor:

1. **Standardizasyon şu durumlarda tercih edilir:**
   
   - Verinin normal dağılıma yakın olduğu durumlarda
   - Linear Regression, Neural Networks, PCA gibi algoritmalarda
   - Aykırı değerlerin çok olduğu veri setlerinde

2. **Normalizasyon şu durumlarda tercih edilir:**
   
   - Verinin belirli bir aralıkta olması gerektiğinde (örneğin görüntü işleme)
   - K-Means, KNN gibi uzaklık temelli algoritmalarda
   - Verideki aykırı değerlerin önemli olduğu durumlarda

## Gerçek Hayattan Bir Örnek

Diyelim ki bir e-ticaret sitesi için ürün öneri sistemi geliştiriyorsunuz. Elimizde şöyle değişkenler var:

- Ürün fiyatı (10-10000 TL arası)
- Kullanıcı puanı (1-5 arası)
- Stok miktarı (0-1000 arası)

Bu durumda şöyle bir yaklaşım izleyebiliriz:

```python
from sklearn.preprocessing import StandardScaler
import pandas as pd

def prepare_product_data(df):
    # Sürekli değişkenleri seçelim
    numeric_features = ['fiyat', 'stok_miktari', 'kullanici_puani']

    # StandardScaler uygulayalım
    scaler = StandardScaler()

    try:
        df[numeric_features] = scaler.fit_transform(df[numeric_features])
        print("Veri ön işleme başarılı!")
        return df
    except Exception as e:
        print(f"Hata oluştu: {str(e)}")
        return None
```

## Önemli Noktalar

1. Standardizasyon/Normalizasyon işlemini sadece numeric değişkenlere uyguluyoruz
2. Test verisine, eğitim verisinde kullandığımız scaler'ı uygulamalıyız
3. İşlem öncesi eksik değerleri (NA/null) temizlemeliyiz

## Performans Etkisi

Bu ön işleme adımları başlangıçta fazladan iş gibi görünebilir. Ancak:

- Algoritmanın yakınsama hızını artırır
- Daha doğru sonuçlar elde etmemizi sağlar
- Farklı ölçeklerdeki değişkenlerin eşit şekilde değerlendirilmesini sağlar

Özetle, veri ön işleme adımlarını atlamamak gerekiyor. Hele ki büyük veri setlerinde ve karmaşık modellerde, bu adımların önemi daha da artıyor.

Not: Her zaman veri setinizi ve kullanacağınız algoritmayı göz önünde bulundurarak hangi yöntemi kullanacağınıza karar verin. Bazen ikisini birlikte kullanmak da gerekebilir.
