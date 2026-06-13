### Bölüm 1

## Mesafe: Yakınlığın En Eski Sezgisi

İki şeyin birbirine ne kadar yakın olduğunu sormak, ölçmenin en eski biçimidir. Ama "yakın" kelimesi göründüğü kadar masum değildir. Bir haritada iki şehir, bir cümlede iki kelime, bir veritabanında iki müşteri — her biri için "yakınlık" başka bir şey demektir.

Bu yazının tamamı şu tek sorunun farklı kılıklarını anlatıyor: *bu ikisi birbirine ne kadar yakın?* Ve bu bölümde en eski, en somut cevapla başlıyoruz: uzaydaki iki nokta arasındaki fiziksel boşluk. Ama daha en baştan göreceğiz ki bu "boşluk" bile tek bir şey değil. Kuşa sorarsanız başka, taksiye sorarsanız başka, verinin şekline sorarsanız bambaşka bir cevap alırsınız.

Önemli bir not: bu ölçülerin hiçbiri durduk yere bulunmadı. Her birinin arkasında çözülmesi gereken gerçek bir sıkıntı vardı. O yüzden her ölçüye, onu doğuran problemden gireceğiz.

## Sıkıntı: Tarladan geometriye

Mesafe ölçme ihtiyacı matematikten eskidir. Nil kıyısındaki tarlalar her yıl taşkınla siliniyor, sular çekilince sınırların yeniden çizilmesi gerekiyordu. "Şu taştan bu kazığa kaç adım?" sorusu soyut bir merak değil, bir mülkiyet sorusuydu. Yanlış ölçüm, kaybedilen tarla, ödenmeyen vergi demekti. Mısırlı arazi ölçücüleri — Yunancada *harpedonaptai*, yani "ip gerenler" — gergin iplerle dik açılar kuruyor, araziyi üçgenlere bölüyordu.

Bu pratik zanaat, yaklaşık MÖ 300 civarında Öklid'in elinde soyut bir kurala dönüştü. Bir dik üçgende kenarlar arasındaki o meşhur ilişki — bugün Pisagor adıyla andığımız bağıntı — aslında tek bir soruya verilen cevaptır: *düz çizgi boyunca uzaklık nasıl hesaplanır?*

Mantığı şöyle. İki nokta arasında bir yatay fark, bir de dikey fark vardır. Bu ikisi birbirine dik olduğu için bir dik üçgen oluştururlar. Aradığımız düz mesafe ise bu üçgenin hipotenüsüdür. Ve hipotenüsün uzunluğu, iki dik kenarın karelerinin toplamının köküne eşittir.

![Öklid mesafesi: dik üçgenin hipotenüsü](fig_euclid.svg)

Resimdeki gibi yatayda 3, dikeyde 4 birim fark olsun. Mesafe şöyle çıkar: 3'ün karesi 9, 4'ün karesi 16, toplamı 25, kökü 5. İşte A ile B arasındaki düz mesafe tam olarak 5 birimdir.

Bunu bir kuş uçuşu gibi düşünün. Kuşun umurunda değildir caddeler, binalar, engeller. A'dan B'ye en kısa çizgiyi çeker ve uçar. Öklid mesafesi her zaman bu en kısa, en doğrudan, hiçbir engel tanımayan yoldur.

Bu fikrin en güzel yanı, boyut sayısından bağımsız çalışmasıdır. İki boyutta iki fark vardı; üç boyutta üç fark olur, hepsinin karesini toplar, kökünü alırsınız. Beş yüz boyutta beş yüz fark olur — kural değişmez. Çocukken kâğıda çizdiğimiz o küçük dik üçgenin mantığı, modern verinin yaşadığı yüzlerce boyutlu uzaylarda da aynen geçerlidir. Boyut sayısı artar, fikir aynı kalır.

> **Adım adım: Öklid mesafesi**
> *(Bu kutuları atlayabilirsiniz; meraklı okur için işin matematiğini somutlaştırırlar.)*
>
> Bir şeyi gerçekten anladığımızdan emin olmanın en iyi yolu, onu en yalın haliyle kendi elimizle kurmaktır. Öklid mesafesi yalnızca dört işlemdir: çıkar, karesini al, topla, kökünü al.
>
> ```python
> import numpy as np
>
> a = np.array([1, 2])
> b = np.array([4, 6])
>
> fark    = a - b              # [-3, -4]
> kareler = fark ** 2          # [9, 16]
> toplam  = kareler.sum()      # 25
> oklid   = np.sqrt(toplam)    # 5.0
>
> # numpy'ın tek satırlık hazır hali, birebir aynı sonuç:
> print(np.linalg.norm(a - b))   # 5.0
> ```
>
> Karesini almanın iki işi var. Birincisi, işaretten kurtulur: −3 ile +3 aynı uzaklıktır, ikisinin de karesi 9'dur. İkincisi — ve bu kritik — büyük farkları orantısız biçimde büyütür. Bu özellik ileride hem işimize yarayacak hem de başımıza dert açacak.

İki bin üç yüz yıl boyunca "uzaklık" denince akla gelen tek şey buydu. Sonra şehirler büyüdü ve bu zarif formül duvara tosladı.

## Sıkıntı: Kuş uçuşu, ama biz kuş değiliz

Manhattan'da bir taksi şoförüsünüz. Müşteri arabaya biniyor, adresi veriyor, "ne kadar tutar?" diye soruyor. Öklid'in cevabı — kuş uçuşu mesafe — burada hiçbir işe yaramaz. Çünkü arabanız binaların içinden geçemez. Manhattan ızgara gibi kurulmuş bir şehirdir; yalnızca caddeler boyunca, köşelerde dönerek gidebilirsiniz.

Diyelim müşteri üç blok doğuda, iki blok kuzeyde bir yere gidiyor. Kuş, çapraz bir çizgi çizip yaklaşık 3.6 blokluk bir mesafe uçardı. Ama siz taksiyle önce üç blok doğu, sonra iki blok kuzey gitmek zorundasınız: toplam beş blok. Köşegen diye bir seçeneğiniz yok.

![Kuş düz uçar, taksi cadde boyunca gider](fig_manhattan.svg)

İşte **Manhattan mesafesi** buradan doğdu — adını tam da bu ızgara şehirden alır; literatürdeki bir diğer adı "şehir bloğu mesafesi"dir. Kuralı Öklid'den daha da basittir: farkların karesini falan alma, sadece mutlak değerlerini topla. Köşegen yok, kestirme yok; yalnızca yatay ve dikey adımlar.

Aynı iki nokta için (yatayda 3, dikeyde 2) iki ölçü iki farklı cevap verir. Öklid yaklaşık 3.6 der — kuşun gerçeği. Manhattan 5 der — taksinin gerçeği. Peki hangisi doğru?

İkisi de doğru. Çünkü sorulan soru farklı. Biri "boşlukta düz çizgi ne kadar?" diye soruyor, diğeri "bu ızgarada hareket ederek kaç adım?" diye. Ölçü, dünyada hareketin nasıl gerçekleştiğine dair bir varsayımı içinde taşır.

> **Çatlak: "Mesafe" diye tek bir şey yok**
>
> Buradaki ders, yazının geri kalanının habercisidir, o yüzden durup altını çizelim. "Mesafe" tek bir nesnel gerçek değil, bir *seçim*. Hangi mesafeyi kullandığınız, dünyaya hangi soruyu sorduğunuzu ele verir. Kuş için Öklid doğru, taksi için Manhattan.
>
> Bu, ölçü seçmenin aslında modelleme yapmak olduğu anlamına gelir. "Bu problemde bir noktadan diğerine nasıl gidilir? Düz çizgiyle mi, ızgarayla mı, yoksa bambaşka bir kuralla mı?" Yanlış mesafeyi seçmek, yanlış soruya kusursuz bir cevap vermektir — ve bu, sessizce yapılan en sık hatalardan biridir. Bir kümeleme algoritması beklenmedik sonuçlar veriyorsa, suçlu çoğu zaman algoritma değil, ona verilmiş yanlış mesafe tanımıdır.

Manhattan mesafesinin gündelik hayatın çok ötesinde bir kariyeri var. Yüksek boyutlu ve seyrek verilerde — yani çoğu değeri sıfır olan dev vektörlerde — Öklid'e tercih edilir, çünkü karesini alma işlemi az sayıdaki büyük farkı abartırken, mutlak değer daha dengeli davranır. Lasso adıyla bilinen ünlü bir istatistik yönteminin kalbinde de bu mantık vardır.

## Tek çatı: Minkowski ve ayar düğmesi

Bir matematikçinin gözüyle bakınca Öklid ile Manhattan tuhaf biçimde akrabadır. Biri farkların *karesini* (yani 2. kuvvetini) alıp topluyor, sonra *kökünü* (yani 1/2. kuvvetini) alıyor. Diğeri farkların *1. kuvvetini* alıp topluyor, sonra *1. kökünü* alıyor — ki bir şeyin 1. kuvveti ve 1. kökü kendisidir, o yüzden Manhattan'da sadece topluyormuş gibi görünür. İki formül de aynı iskelete sahip: kuvvet al, topla, kök al. Fark yalnızca o kuvvetin değerinde.

Hermann Minkowski bunu gördü ve iki formülü tek bir denkleme sığdırdı; içine de bir ayar düğmesi koydu. Bu düğmenin adı **p**. Kural şu: her boyuttaki farkın **p**. kuvvetini al, hepsini topla, sonra toplamın **p**. kökünü al.

Önce şunu net oturtalım, çünkü kolayca karışıyor: kuvvetini aldığımız şey iki *nokta* değil, boyut boyut hesapladığımız *farklardır*. İki nokta arasında her eksende bir fark vardır; Minkowski o farklarla oynar.

Bir örnekle yürüyelim. İki noktamız olsun, A = (1, 4) ve B = (4, 6). Önce boyut boyut farkları buluyoruz: yatayda 4−1 = 3, dikeyde 6−4 = 2. Yani elimizde iki fark var: **3 ve 2**. Minkowski mesafesi bu iki sayıyla şunu yapar:

1. Her farkın p. kuvvetini al.
2. Bunları topla.
3. Toplamın p. kökünü al.

Yani sonuç `(3^p + 2^p)` ifadesinin p. köküdür. Şimdi p düğmesini çevirelim ve ne olduğunu izleyelim.

**p = 1 olduğunda:** `(3¹ + 2¹)` yani `3 + 2 = 5`, kökü de kendisi. Sonuç **5**. Bu tam olarak Manhattan mesafesidir.

**p = 2 olduğunda:** `(3² + 2²)` yani `9 + 4 = 13`, karekökü yaklaşık **3.6**. Bu da Öklid mesafesi.

Yani Öklid ve Manhattan iki ayrı icat değil; aynı düğmenin iki farklı konumu. Minkowski'nin yaptığı, dağınık görünen bir mesafe ailesini tek bir denklemin altında toplamaktı. Ama asıl ilginç olan, düğmeyi daha da çevirince ne olduğu.

## Düğmeyi sonuna kadar çevirmek: p sonsuza giderken

Burada çok yaygın bir kafa karışıklığını baştan dağıtalım. Sonsuza giden şey **p**, yani ayar düğmesi. Mesafenin kendisi sonsuza gitmiyor. Tam tersine, mesafe gayet sonlu bir sayıya — farkların en büyüğüne — doğru yaklaşıyor.

Aynı örnekle (farklar 3 ve 2) düğmeyi çevirmeye devam edelim:

| p değeri | Hesap | Sonuç | Karşılığı |
|---|---|---|---|
| 1 | 3 + 2 | 5.000 | Manhattan |
| 2 | √(9 + 4) | 3.606 | Öklid |
| 3 | (27 + 8)^(1/3) | 3.271 | — |
| 10 | (3¹⁰ + 2¹⁰)^(1/10) | 3.005 | — |
| ∞ | en büyük farka iner | 3.000 | Chebyshev |

Sonucun nasıl adım adım 5'ten 3'e indiğine ve 3'ün altına hiç düşmediğine dikkat edin. Grafiğe dökünce bu iniş çok daha net görünür:

![p büyüdükçe mesafe en büyük farka iner](fig_pdial.svg)

Eğri yumuşakça düşüyor ve 3 çizgisine yaslanıyor ama onu asla geçmiyor. Peki neden? Neden en büyük fark belirleyici oluyor?

Sezgi şu: büyük kuvvetler büyük sayıları orantısız biçimde şişirir. p = 10'da, 3'ün onuncu kuvveti 59.049; 2'nin onuncu kuvveti ise sadece 1.024. Toplamın içinde 2'nin katkısı neredeyse görünmez hale geldi — 3'ün yanında kırıntı kaldı. Kuvvet ne kadar büyürse, küçük fark o kadar siliniyor. Sonunda yalnızca en büyük fark söz sahibi oluyor.

> **Adım adım: Neden en büyük fark kazanıyor?**
>
> İnişi cebirle de görebiliriz. `(3^p + 2^p)^(1/p)` ifadesinde en büyük farkı, yani 3'ü, parantezin dışına çekelim:
>
> ```
> (3^p + 2^p)^(1/p)  =  3 · (1 + (2/3)^p)^(1/p)
> ```
>
> Şimdi kritik terime bakın: `(2/3)^p`. 2/3 birden küçük bir sayı (yaklaşık 0.67). Birden küçük bir sayının kuvveti büyüdükçe sıfıra koşar: 0.67, sonra 0.44, sonra 0.018... p sonsuza giderken bu terim tamamen kaybolur. Geriye yalnızca `3 · 1 = 3` kalır.
>
> İşte matematiksel sebep bu: en küçük farkın en büyük farka oranı, yüksek kuvvetlerde eriyip gider. Geriye yalnızca en büyük fark kalır.

Bu uç noktadaki ölçünün de bir adı var: **Chebyshev mesafesi**. Tanımı son derece sade: boyutlar arasındaki farklardan yalnızca en büyüğüne bakar, geri kalanını yok sayar.

Bunu en iyi satranç tahtası anlatır. Tahtada şah her yöne bir kare gidebilir — yatay, dikey *ve çapraz*. Diyelim şah, bulunduğu yerden 3 kare sağda ve 2 kare yukarıda olan bir kareye gitmek istiyor. Kaç hamle gerekir? Cevap 3'tür, 5 değil. Çünkü şah çapraz gidebildiği için ilk iki hamlede hem sağa hem yukarı aynı anda ilerler (2 sağ, 2 yukarı); kalan tek hamlede yalnızca sağa gider. Toplam üç hamle. Küçük olan fark (yukarıdaki 2), büyük olanın (sağdaki 3) içinde bedavaya halloldu. Şah için doğru mesafe işte budur: iki yöndeki farkın büyük olanı.

## Üç şeklin hikâyesi: birim çemberler

Bu üç mesafe arasındaki farkı görmenin en zarif yolu, her birinin "birim çemberini" çizmektir. Birim çember şu demek: merkeze uzaklığı tam olarak 1 olan bütün noktalar kümesi.

Öklid'de bu, beklediğiniz şeydir — bir daire. Merkezden her yöne eşit uzaklıktaki noktalar bir çember çizer; bu sezgimize o kadar uyar ki "çember" deyince zaten bunu düşünürüz. Ama Manhattan'da "uzaklık 1" bambaşka bir şekil verir, çünkü orada uzaklık yatay artı dikey adımların toplamıdır. Chebyshev'de ise yine başka bir şekil çıkar.

![Aynı kural, farklı şekil: üç mesafenin birim çemberi](fig_unitballs.svg)

Manhattan'ın birim "çemberi" bir elmastır, köşeleri eksenlerin üstünde. Çünkü merkezden uzaklığı 1 tutmak için, bir yöne ne kadar giderseniz diğer yönden o kadar kısmanız gerekir — bu da köşegen kenarlar verir. Chebyshev'inki ise bir karedir, çünkü yalnızca en büyük fark önemli olduğundan, her iki eksende de 1'i geçmediğiniz sürece "uzaklık 1" sayılırsınız.

Daire bize doğal gelir çünkü gözümüz Öklidçidir. Ama elmas da, kare de eşit derecede geçerli birer "uzaklık 1" tanımıdır. Hangisinin doğru olduğu, yine sorduğunuz soruya bağlı.

İşte bu bölümde gördüğümüz mesafe ailesinin özeti:

| Mesafe | p değeri | Kuralı | Gerçek hayattaki sorusu | Birim çemberi |
|---|---|---|---|---|
| Manhattan | 1 | Mutlak farkları topla | Izgarada taksi kaç blok gider? | Elmas |
| Öklid | 2 | Karelerin toplamının kökü | Kuş uçuşu kaç metre? | Daire |
| (ara değerler) | 3, 4… | Büyük farkları öne çıkarır | Büyük sapmalar daha mı önemli? | Köşeleri yuvarlanmış kare |
| Chebyshev | ∞ | En büyük farkı al, gerisini at | Şah kaç hamlede ulaşır? | Kare |

## Peki ya aradaki değerler? p = 3, p = 4

Genelde üç ezber değer konuşulur: p=1, p=2 ve p=∞. Ama düğme kesintisizdir; 1 ile 2 arasında, 2 ile sonsuz arasında her değeri alabilir. Peki p=3 ya da p=4 ne işe yarar?

Bu ara değerler, Öklid ile Chebyshev arasında bir yerde dururlar. Karesini almaktan daha sert biçimde büyük farkları cezalandırırlar, ama henüz tamamen "yalnızca en büyük fark önemli" noktasına varmazlar. Bunları, **büyük sapmaların küçüklerden daha çok önemsenmesini istediğiniz** durumlarda kullanırsınız. Eğer iki nokta tek bir boyutta çok ayrışıyorsa, p'yi büyütmek bu ayrışmayı mesafeye daha güçlü yansıtır.

Pratikte bu değerlerin gizli bir mesajı var: **p'nin "doğru" değeri evrensel değildir, veriye bağlıdır.** Çoğu uygulamada p genellikle 2, 3 ya da 4 arasından seçilir, ama hangisinin en iyi çalışacağı önceden bilinemez. Bu yüzden p, tıpkı bir modelin diğer ayarları gibi, deneyle belirlenir: çapraz doğrulama denen yöntemle farklı p değerleri tek tek denenir, hangisi en iyi sonucu veriyorsa o seçilir. Minkowski bize tek bir mesafe değil, denenecek bir mesafeler yelpazesi verdi.

p=∞ ucu, yani Chebyshev, oyunlardan ibaret değildir. **En kötü durumun belirleyici olduğu** her yerde işe yarar: bir kalite kontrol sürecinde "hangi tek ölçü en çok saptı?" diye soruyorsanız, depo lojistiğinde bir vincin hem yatay hem dikey aynı anda hareket edip darboğazı en uzun eksenin oluşturduğu durumlarda, ya da bir sistemde tek bir aşırı sapmanın bütün sonucu bozabileceği senaryolarda. Toplam sapma değil, en büyük tek sapma önemliyse, Chebyshev tam da onu ölçer.

## İlk büyük tehlike: ölçek ve boyutun laneti

Düşünmeden uygulanan Öklid'in çöktüğü iki yer var. İkisi de yazının ilerisi için kritik olduğundan üstünde duralım.

**Birincisi: ölçek sorunu.** Bir müşteri veritabanı düşünün. Bir sütun "yaş" (kabaca 20 ile 70 arası), bir sütun "yıllık gelir" (20.000 ile 500.000 arası). İki müşteri arasındaki Öklid mesafesini ham haliyle hesaplarsanız, gelir farkı yaş farkını tamamen ezer. Neden? Çünkü gelir sayıları çok daha büyük. İki müşterinin yaşı 25 yıl ayrı, gelirleri 25.000 lira ayrı olsun. Öklid bu ikisini topladığında 25'in karesi (625) ile 25.000'in karesi (625 milyon) yan yana gelir. Yaş, hesaba neredeyse hiç katılmamış gibi olur; mesafe tamamen gelirin esiri olur.

Çözüm, değişkenleri ortak bir ölçeğe çekmektir — buna normalleştirme denir. Ama mesele daha derine gider, çünkü normalleştirme her değişkeni eşit ve bağımsız sayar, oysa bazı değişkenler birbiriyle ilişkilidir. Bu ipliği birazdan Mahalanobis çözecek.

**İkincisi, ve daha şaşırtıcı olanı: boyutun laneti.** Öklid sezgimiz iki-üç boyutta kusursuzdur. Ama modern verinin yaşadığı yer yüzlerce, hatta binlerce boyutlu uzaylardır — ve orada çok tuhaf bir şey olur. Boyut sayısı arttıkça, bütün noktalar birbirine neredeyse *eşit* uzaklıkta görünmeye başlar. En yakın komşunuzla en uzak komşunuz arasındaki mesafe farkı erir gider.

Bunu bir deneyle gösterelim. Uzaya rastgele 500 nokta serpeleyelim, bir de sorgu noktası koyalım. Bu sorguya en yakın nokta ile en uzak nokta arasındaki mesafe oranına bakalım. İki boyutta en uzak nokta, en yakından kat kat uzaktadır — oran büyüktür, "yakın" ve "uzak" anlamlıdır. Ama boyutu artırdıkça:

![Boyut arttıkça en yakın ve en uzak nokta birbirine yaklaşır](fig_curse.svg)

Oran hızla 1'e doğru çöküyor. Yüz boyutta en uzak komşu, en yakın komşudan yalnızca biraz daha uzakta. "En yakın" kavramı anlamını yitiriyor, çünkü her şey aşağı yukarı aynı uzaklıkta. Bu, en yakın komşu aramasından kümelemeye kadar pek çok yöntemi yüksek boyutta sessizce işe yaramaz hale getiren derin bir sorundur.

Bu yüzden yüksek boyutlu veride çıplak Öklid mesafesi çoğu zaman terk edilir. Onun yerine — bir sonraki bölümün konusu olan — açı tabanlı ölçüler devreye girer. Çünkü iki vektör birbirine ne kadar *uzak* olursa olsun, aynı *yöne* bakıp bakmadıkları hâlâ anlamlı bir soru olarak kalır. Ama oraya gelmeden önce, mesafe fikrinin en zarif devrimini görmemiz gerek.

## Mahalanobis: Bir nokta tek başına uzak değildir

Şimdiye kadar mesafeyi, uzay her yöne eşit yayılmış gibi düşündük. İki nokta arasındaki farkları aldık, topladık, kareledik, kökünü aldık. Ama gerçek veride işler çoğu zaman böyle değildir. Veri her yöne eşit dağılmaz; bazı yönlerde genişler, bazı yönlerde sıkışır. Yani verinin bir şekli vardır.

Mahalanobis mesafesinin temel fikri burada başlar:

*Bir noktanın ne kadar uzak olduğu, yalnızca merkeze olan düz mesafesine değil, veri bulutunun şekline de bağlıdır.*

Bunu şöyle düşünelim. Bir müşteri grubu var. Gelir, yaş, harcama, kredi limiti gibi özelliklerle temsil ediliyorlar. Bu müşteriler uzayda rastgele dağılmış noktalar gibi görünmez; çoğu zaman belli bir yöne doğru uzayan bir bulut oluştururlar. Çünkü bazı değişkenler birlikte hareket eder. Geliri yüksek olanın kredi limiti de yüksek olabilir. Boyu uzun olanın kol uzunluğu da uzun olabilir. Yani veri yuvarlak bir top değil, çoğu zaman eğik bir elips gibidir.

Öklid mesafesi bu şekli görmez. Merkezden aynı düz uzaklıktaki iki noktayı aynı derecede uzak sayar.

Ama bu yanıltıcı olabilir.

Bir nokta, veri bulutunun uzadığı yönde merkezden uzaklaşmışsa bu çok şaşırtıcı değildir. Çünkü veri zaten o yöne yayılıyordur. Başka bir nokta ise bulutun dar olduğu yönde biraz uzaklaşmışsa çok daha şüpheli olabilir. Çünkü veri o yönde neredeyse hiç yayılmıyordur.

Mahalanobis işte bu ayrımı yapar.

Öklid şunu sorar: *Merkezden kaç birim uzaktasın?*

Mahalanobis ise şunu sorar: *Merkezden uzaksın — ama verinin alışık olduğu yönde mi uzaksın, yoksa beklenmedik bir yönde mi?*

Sezgisel olarak Mahalanobis'in yaptığı şey şudur: veri bulutunu önce yuvarlak hale getirecek şekilde uzayı düzeltir. Bulut hangi yönde çok yayılmışsa o yönü sıkıştırır; hangi yönde dar kalmışsa o yönü genişletir. Sonra sıradan Öklid mesafesini ölçer.

Bu yüzden Mahalanobis mesafesinde aynı düz uzaklık, farklı anlamlara gelebilir. Bulutun doğal yayılma yönünde uzak olmak daha az şaşırtıcıdır. Bulutun dar olduğu yönde uzak olmak ise daha şüphelidir.

Bu yüzden Mahalanobis özellikle anomali tespitinde güçlüdür. Bir kredi kartı işlemi, bir üretim hattı ölçümü ya da bir sunucu trafiği örüntüsü normal mi, yoksa alışılmadık mı? Soru aslında şudur: *Bu yeni nokta, geçmiş verinin oluşturduğu buluta göre ne kadar yabancı?*

Öklid mesafesi yalnızca düz uzaklığı görür. Mahalanobis ise uzaklığı, verinin gerçek şekline göre yorumlar.

## Metrik olmak: Bir mesafenin uyması gereken kurallar

Şimdiye kadar "mesafe" derken sezgiye güvendik. Ama matematikçiler, bir ölçünün gerçekten "mesafe" — teknik adıyla *metrik* — sayılması için dört kurala uymasını şart koşar. Bunlar keyfi kurallar değil; her biri sağduyunun bir ifadesidir.

| Kural | Teknik adı | Sağduyudaki karşılığı |
|---|---|---|
| Mesafe asla negatif olamaz | Negatif olmama | Bir yer "eksi 3 metre" uzakta olamaz |
| Mesafe sıfırsa, iki nokta aynıdır | Ayırt edilemezlik | Yalnızca kendinden uzaklığın sıfırdır |
| A'dan B'ye = B'den A'ya | Simetri | Gidiş ile dönüş aynı uzunluktadır |
| Dolambaçlı yol asla kısaltmaz | Üçgen eşitsizliği | İki nokta arası en kısa yol düz çizgidir |

Bu sonuncusu — üçgen eşitsizliği — en derin olanıdır ve ismini hak eder. "A'dan doğrudan C'ye gitmek, araya B'yi katıp gitmekten asla daha uzun olamaz" der. Bir ara durak eklemek mesafeyi ya artırır ya da en iyi ihtimalle aynı bırakır; ama yolu sihirli biçimde kısaltamaz.

Bu kural kuru bir matematik kaprisi değildir. En yakın komşu aramayı hızlandıran pek çok akıllı algoritma — örneğin KD-tree, ball tree veya metric tree türü yapılar — tam da üçgen eşitsizliğine güvenerek çalışır. Bazı adayları hiç hesaplamadan eleyebilirler, çünkü "buradan daha yakın sonuç çıkamaz" diyebilirler. Kural kırılırsa, bu güven boşa düşer; algoritma hızlı çalışmaya devam eder ama sessizce yanlış cevap verebilir.

Bu bölümde gördüğümüz dört ölçü — Öklid, Manhattan, Minkowski, Mahalanobis — dördü de bu dört kuralı sağlar. Hepsi gerçek birer metriktir; "mesafe" adını tam anlamıyla hak ederler.

Peki bunu neden bu kadar vurguluyoruz? Çünkü ileride öyle ölçülerle karşılaşacağız ki, adlarında "distance" geçmesine rağmen bu kuralları çiğnerler. En ünlüsü olan KL ıraksaması, A'dan B'ye sapmayı B'den A'ya sapmaya eşit saymaz — yani simetri kuralını açıkça kırar. Tam da bu yüzden ona teknik olarak "mesafe" denmez, "ıraksama" denir. Bu, kelime oyunu değil, derin bir uyarıdır: bir ölçünün adında "distance" geçiyor olması, onun bir mesafe gibi davranacağı anlamına gelmez. Ama o hikâye birkaç bölüm sonrasının konusu.

## Mesafenin haritadaki yeri

Toparlayalım. Bu bölümde gördüğümüz mesafe ölçüleri ve tipik kullanım alanları:

| Ölçü | Nerede kullanılır |
|---|---|
| Öklid | Kümeleme (k-means), en yakın komşu, coğrafi uzaklık, düşük boyutlu veri |
| Manhattan | Izgara tabanlı yollar, yüksek boyutlu ve seyrek veri, Lasso türü yöntemler |
| Minkowski | Genel amaçlı; p ayarlanarak probleme uydurulur (çapraz doğrulamayla seçilir) |
| Chebyshev | En kötü durum analizi, lojistik, kalite kontrol, tahta oyunları |
| Mahalanobis | Anomali tespiti, sınıflandırma, kalite kontrol, ilişkili değişkenler |

Mesafe, yakınlığın en eski ve en somut sezgisidir: iki noktayı ayıran fiziksel boşluk. Ama bu kısa yolculukta bile gördük ki o "boşluk" tek bir şey değil. Kuşa göre düz çizgi, taksiye göre ızgara adımları, satranç şahına göre en büyük fark, verinin şekline göre eğilip bükülen bir uzaklık. Hepsi "mesafe" adını taşıyor, ama her biri dünyaya başka bir soru soruyor.

Şimdi daha tuhaf bir soru bizi bekliyor. Ya karşılaştırdığımız şeyler uzaydaki noktalar değilse? Ya iki metin belgesini, iki kullanıcının zevkini, iki kelimenin anlamını karşılaştırıyorsak? O zaman aralarındaki "boşluğu" ölçmek çoğu zaman yanlış sorudur. Onların aynı *yöne* bakıp bakmadığını sormamız gerekir. İşte bir sonraki bölümün konusu bu: mesafenin değil, benzerliğin ölçüleri — ve kelimeleri sayıya çevirdiğimizde ortaya çıkan o olağanüstü an, "kral eksi erkek artı kadın eşittir kraliçe."

---

*Sonraki bölüm — **Benzerlik: Uzaklık değil, yön.** Cosine benzerliği neden iki belgenin "boyunu" değil "yönünü" ölçer, dot product onunla nasıl akrabadır, ve embedding'ler kelimelerin anlamını nasıl bir yöne dönüştürüp aritmetiğe sokar.*
