# Veri Analizinde Kullanılan Mesafe Ölçüleri

Veri analizi ve makine öğrenmesinde mesafe ölçüleri, veri noktaları arasındaki benzerliği veya farklılığı ölçmek için kullanılır. Kümeleme, sınıflandırma ve boyut azaltma gibi pek çok yöntemin temelinde bu ölçüler yer alır.

## 1. Öklid Mesafesi

İki nokta arasındaki düz çizgi mesafesidir.

- Formül: `sqrt(sum((x_i - y_i)^2))`
- Özellik: sezgiseldir ve gerçek geometrik uzaklığa yakındır
- Kullanım: sürekli ve normal dağılmış veriler

Gerçek hayat örneği: Bir emlak uygulamasında müşterinin istediği lokasyona en yakın evleri sıralamak.

## 2. Manhattan Mesafesi

Yatay ve dikey eksenlerde kat edilen toplam mesafeyi ölçer.

- Formül: `sum(|x_i - y_i|)`
- Özellik: aykırı değerlere Öklid kadar duyarlı değildir
- Kullanım: ızgara yapılı alanlar veya farklı ölçeklerdeki özellikler

Gerçek hayat örneği: Manhattan sokak planında taksinin bir noktadan diğerine gitmesi.

## 3. Minkowski Mesafesi

Öklid ve Manhattan ölçülerini genelleyen esnek bir tanımdır.

- Formül: `(sum(|x_i - y_i|^p))^(1/p)`
- Özellik: `p` değerine göre farklı davranış gösterir
- Kullanım: hangi mesafenin daha uygun olduğunu deneysel olarak görmek istediğiniz durumlar

Gerçek hayat örneği: E-ticaret öneri motorunda ürün kategorisine göre farklı mesafe anlayışları kullanmak.

## 4. Cosine Mesafesi

İki vektörün yön benzerliğini ölçer; büyüklükten çok açıya bakar.

- Formül: `1 - (A . B) / (||A|| ||B||)`
- Özellik: ölçekten bağımsızdır
- Kullanım: metin verisi ve yüksek boyutlu seyrek veriler

Gerçek hayat örneği: Belgeleri kelime dağılımlarına göre karşılaştırmak.

## 5. Jaccard Mesafesi

İki kümenin benzerliğini ölçer ve özellikle ikili veriler için kullanışlıdır.

- Formül: `1 - |A ∩ B| / |A ∪ B|`
- Özellik: ortak olmayan öğeleri dikkate alır, 0-0 eşleşmelerini önemsemez
- Kullanım: küme tabanlı problemler, ikili özellikler

Gerçek hayat örneği: İki kullanıcının izlediği film listelerinin ne kadar benzer olduğunu bulmak.

## 6. Mahalanobis Mesafesi

Değişkenler arasındaki korelasyonu da hesaba katar.

- Formül: `sqrt((x-mu)^T S^-1 (x-mu))`
- Özellik: kovaryans yapısını dikkate alır
- Kullanım: çok değişkenli ve korelasyonlu veri

Gerçek hayat örneği: Kredi skorlama sistemlerinde müşteri profilinin normal profilden ne kadar saptığını ölçmek.

## 7. Kullback-Leibler Divergence

Teknik olarak bir mesafe değil, iki olasılık dağılımı arasındaki farkı ölçen bir ıraksama ölçüsüdür.

- Formül: `D_KL(P||Q) = sum(P(x) * log(P(x) / Q(x)))`
- Özellik: asimetriktir
- Kullanım: dağılım karşılaştırmaları, anomali tespiti, dil modeli analizleri

Gerçek hayat örneği: Bir metnin hangi yazara daha yakın olduğunu kelime dağılımı üzerinden ölçmek.

## Hangi durumda hangisi?

- Sürekli ve geometrik veriler: Öklid
- Izgara tipi hareket veya aykırı değer duyarlılığı: Manhattan
- Parametrik esneklik istiyorsanız: Minkowski
- Metin ve embedding benzerliği: Cosine
- Küme ve ikili özellikler: Jaccard
- Korelasyonlu çok değişkenli yapı: Mahalanobis
- Olasılık dağılımları: KL Divergence

## Sonuç

Mesafe ölçüsü seçimi doğrudan model kalitesini etkiler. Tek bir doğru ölçü yoktur; veri yapısı, problem tipi ve yorum ihtiyacı hangi yaklaşımın doğru olduğunu belirler.