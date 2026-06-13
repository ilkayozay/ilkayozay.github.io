### **Ön Eğitim Verisi (İnternet)**

Birden fazla aşamadan oluşan, sıralı ilerleyen bir süreç var. İlk aşama, **ön eğitim aşaması** olarak adlandırılıyor ve bu aşamanın ilk adımı, internetten veri indirme ve işleme sürecidir.

Bu sürecin genel hatlarını anlamak için şu URL'ye ( [HuggingFaceFW/fineweb · Datasets at Hugging Face](https://huggingface.co/datasets/HuggingFaceFW/fineweb) ) göz atmanızı öneririm. **Hugging Face** adlı şirket, **FineWeb** adında bir veri kümesi oluşturdu, derledi ve düzenledi. Bu blog yazılarında, FineWeb veri kümesini nasıl oluşturduklarına dair ayrıntılı bilgiler mevcut. Büyük dil modeli sağlayıcılarının (OpenAI, Anthropic, Google vb.) her biri, FineWeb’e benzer kendi iç veri kümelerine sahiptir.

### Amaç Nedir?

Burada hedefimiz, internetten **büyük miktarda metin** toplamaktır. Bunun için kamuya açık kaynaklardan **çok yüksek kaliteli belgeler** alıyoruz. Ayrıca, modelin geniş bir bilgi yelpazesine sahip olması için **çeşitliliği yüksek** belgeleri de kapsamak istiyoruz. Ancak bunu başarmak oldukça karmaşık bir süreçtir ve birçok aşamadan geçer.

Örneğin, üretim seviyesinde bir uygulamada kullanılan FineWeb veri kümesi, **sadece 44 terabayt** civarında bir disk alanı kaplar. Günümüzde 1 terabaytlık bir USB belleği kolayca edinebilirsiniz, hatta bu veri tek bir sabit diske bile sığabilir. Yani internet devasa bir kaynak olsa da, üzerinde sıkı filtrelemeler yapıldığı için elde edilen nihai metin miktarı görece küçüktür.

### İlk Adım: Common Crawl Verisi

Bu tür çalışmaların çoğunda başlangıç noktası, **Common Crawl** adlı kuruluş tarafından sağlanan veridir. Common Crawl, **2007'den beri interneti tarayan bir sistemdir**. Örneğin, 2024 itibarıyla **2,7 milyar web sayfasını** dizine eklemiş durumda.

**Nasıl Çalışıyor?**

- İlk olarak, belirli bir grup web sitesi başlangıç noktası olarak seçilir.
- Daha sonra, bu sayfalardaki bağlantılar takip edilir ve indeksleme süreci devam eder.
- Böylece zamanla internetten büyük miktarda veri toplanır.

Ancak, **bu ham verinin büyük bir kısmı doğrudan kullanılmaz**. Çeşitli aşamalardan geçerek işlenir ve filtrelenir.

---

### Veri Temizleme ve Filtreleme Süreci

Common Crawl'dan gelen veri oldukça ham ve işlenmemiş olduğu için birkaç farklı aşamadan geçirilerek arındırılır:

#### 1. **URL Filtreleme**

İstenmeyen web siteleri, önceden belirlenen engelleme listelerine göre elenir.  
Bunlar genellikle şunları içerir:

- Kötü amaçlı yazılım içeren siteler
- Spam ve pazarlama siteleri
- Irkçı veya yetişkin içerikli siteler
- Düşük kaliteli içerik üreten siteler

#### 2. **Metin Çıkarma**

Web sayfaları **HTML formatında** saklandığından, içeriğin **sadece metin kısmını** almak gerekir.

- HTML içeriğindeki **CSS, JavaScript, menü öğeleri vb.** temizlenir.
- Sadece **asıl metin içeriği** bırakılır.

#### 3. **Dil Filtreleme**

Örneğin, **FineWeb** veri kümesi bir dil sınıflandırıcısı kullanarak her web sayfasının dilini tahmin eder.

- Eğer bir sayfanın en az %65’i İngilizce değilse, o sayfa elenir.
- Şirketler, veri kümelerinde hangi dillerin ne oranda temsil edileceğini kendileri belirleyebilir.

Bu dil filtreleme aşaması, modelin hangi dillerde daha iyi performans göstereceğini belirler. Örneğin, **İspanyolca içeriği tamamen filtreleyen bir model, İspanyolca konusunda zayıf kalacaktır**.

#### 4. **Diğer Filtreleme Aşamaları**

- **Veri Çoğaltma Kontrolü**: Aynı içeriğin birden fazla kopyası tespit edilerek kaldırılır.
- **Kişisel Bilgi (PII) Temizleme**:
  - Adresler,
  - Sosyal güvenlik numaraları,
  - Kredi kartı bilgileri gibi **kişisel tanımlanabilir bilgiler** tespit edilerek veri kümesinden çıkarılır.

---

### Sonuç: Temizlenmiş ve Filtrelenmiş Metin

Tüm bu işlemlerden sonra, elimizde **yüksek kaliteli ve filtrelenmiş büyük bir metin verisi** olur.

Örneğin, **FineWeb veri kümesini Hugging Face üzerinden herkes indirebilir**.

- İçeriğinde, **2012 yılında gerçekleşen kasırgalar hakkında bir makale**,
- **Böbrek üstü bezleriyle ilgili tıbbi bir içerik** gibi farklı konularda yazılar bulunur.

Bu verileri ham internet metni olarak düşünebiliriz. **Sıradaki adım, bu metinleri sinir ağlarına (neural networks) öğretmek için kullanmaktır**.

Şimdi elimizde büyük bir **metin dokusu** var ve artık **nöral ağları bu metni taklit edecek şekilde eğitmeye başlayabiliriz**.

---

### **Tokenizasyon (Tokenization)**

Elimizdeki bu metni nasıl temsil edeceğimize ve nasıl işleyeceğimize karar vermemiz gerekiyor. Sinir ağlarımızın çalışma prensibi gereği, tek boyutlu bir sembol dizisi beklerler ve yalnızca belirli, sonlu bir sembol kümesini kullanırlar. Bu nedenle, hangi sembolleri kullanacağımıza karar vermeli ve verimizi bu sembollerden oluşan tek boyutlu bir dizilim halinde temsil etmeliyiz.

Şu anda elimizde tek boyutlu bir metin dizisi var. Ekranda iki boyutlu olarak görünüyor olsa da aslında soldan sağa ve yukarıdan aşağıya doğru ilerleyen bir dizidir.

Tabii ki, bu metnin bilgisayarda bir temsili de bulunuyor. Örneğin, eğer bu metni UTF-8 formatında kodlarsak, bilgisayardaki karşılığı olan ham bit dizisini elde edebiliriz. Bu, bilgisayarın metni nasıl gördüğünü gösterir. Örneğin, ilk çubuk burada ilk sekiz bitten oluşur.

Bu bağlamda elimizde yalnızca iki sembol vardır: **0 ve 1**. Çok uzun bir dizi oluşturur ancak yapay sinir ağımızda bu kadar uzun diziler kullanmak pratik değildir. Bunun yerine, elimizdeki sembol boyutu ile dizi uzunluğu arasında bir denge kurmalıyız.

Yalnızca iki sembolle çok uzun diziler kullanmak yerine, daha fazla sembol kullanarak diziyi kısaltmayı tercih ederiz. Bunun en basit yolu, bit gruplarını bir araya getirmektir. Örneğin, sekiz bitlik gruplar oluşturarak bunları **bayt (byte)** olarak ele alabiliriz.

Bitlerin yalnızca **0** veya **1** değerlerini alabileceğini düşündüğümüzde, sekiz bitlik bir grup yalnızca **256 farklı kombinasyon** içerebilir. Bu nedenle, metnimizi bir dizi bayt olarak yeniden düzenleyebiliriz. Bayt dizisi, orijinal bit dizisinden sekiz kat daha kısa olur, ancak bu kez her bayt 0 ile 255 arasında bir değere sahiptir.

Bunları sayılar olarak düşünmek yerine, her birini benzersiz kimlikler veya semboller olarak düşünebilirsiniz. Örneğin, her biri bir **emoji** ile temsil edilseydi, elimizde 256 farklı emoji olurdu.

### **BPE Algoritması (Byte Pair Encoding - BPE)**

Üretim aşamasında kullanılan en gelişmiş dil modelleri, dizileri daha da kısaltmayı hedefler. Bunun için **Byte Pair Encoding (BPE)** adı verilen bir algoritma kullanılır.

Bu algoritma, metin içinde sıkça tekrar eden **bayt çiftlerini** belirleyerek, bunları yeni bir sembol olarak birleştirir. Örneğin, 116 (t) ve 32 (boşluk) çiftinin metin içinde çok sık geçtiğini düşünelim. Bu çifti **yeni bir sembol** olarak tanımlayabiliriz ve ona 256. ID’yi atayabiliriz. Daha sonra, her 116-32 ikilisini bu yeni sembolle değiştirerek dizinin uzunluğunu kısaltabiliriz.

Bu işlem defalarca tekrar edilerek her yeni sembolle dizinin uzunluğu azaltılırken, sembol sayısı artırılır. **Uygulamada ideal bir sembol kümesi büyüklüğü yaklaşık 100.000 civarında** olur.

Örneğin, **GPT-4 tam olarak 100.277 sembolden oluşan bir kelime dağarcığı (vocabulary) kullanmaktadır**.

Metni bu sembollere dönüştürme sürecine **tokenizasyon (tokenization)** denir.

### **GPT-4 Tokenizasyon Süreci**

GPT-4’ün tokenizasyon sürecini görmek için bir araç kullanabiliriz. Bu araç, metni **tokenlere** (küçük dil birimlerine) böler ve her bir tokenin hangi ID’ye karşılık geldiğini gösterir.

Örneğin, **"hello world"** ifadesi şu şekilde tokenize edilir:

- **hello** → Token ID: 15.339
- **" world" (baştaki boşluk dahil)** → Token ID: 1.917

Eğer **"hello"** ve **"world"** arasında iki boşluk bırakırsak, tamamen farklı bir tokenizasyon ortaya çıkar. **Her boşluk bile tokenizasyonu değiştirebilir.**

Bunun yanında, **büyük/küçük harf farklılıkları da önemlidir**. Örneğin:

- **"Hello World"** (ilk harfler büyük) üç token olur.
- **"hello world"** (tamamen küçük harf) iki token olur.

Bu süreç sayesinde, modelin metni daha verimli bir şekilde işlemesi sağlanır.

GPT-4 gibi büyük dil modelleri, ham metinleri bu şekilde tokenlara ayırarak işler. Örneğin, eğer model **62 token uzunluğunda bir giriş alıyorsa**, bunu **100.277 farklı sembol içeren kelime dağarcığına (vocabulary) göre işler**.

Sonuç olarak, **tokenizasyon süreci**, büyük dil modellerinin metni daha küçük ve işlenebilir birimlere ayırmasını sağlar. Burada öğrendiğimiz teknikler, modelin metni nasıl anladığını ve işlediğini anlamamıza yardımcı olur.

---

### Sinir Ağı Girdi/Çıktısı ( Neural Network I/O )

Şimdiye kadar, veri kümesinde bulunan bu metin dizisini aldım ve belirttiğimiz tokenizer kullanarak bir dizi token halinde yeniden temsil ettim. Şimdi bu nasıl göründüğüne bakalım.

Örneğin, **Fine Web** veri kümesine geri döndüğümüzde, bunun yalnızca **44 terabaytlık** bir disk alanı kaplamakla kalmadığını, aynı zamanda yaklaşık **15 trilyon token** içeren bir veri dizisi olduğunu belirtmişlerdi. Burada, veri kümesinin yalnızca ilk birkaç **bin** token'ı yer alıyor, ancak aklımızda tutmamız gereken şey, tüm veri kümesinde toplamda **15 trilyon** token bulunduğudur.

Tekrar hatırlatmak gerekirse, tüm bu token'lar küçük metin parçacıklarını temsil ederler; yani, bunlar dizinin yapı taşlarıdır. Buradaki sayılar, kendiliğinden bir anlam ifade etmez, sadece benzersiz kimlik numaralarıdır.

Şimdi, işin en eğlenceli kısmına, yani **sinir ağı eğitimi** sürecine geliyoruz. Bu, hesaplama açısından oldukça ağır bir işlemdir ve sinir ağlarının eğitilmesi büyük ölçüde bu aşamada gerçekleşir.

Bu adımda yapmak istediğimiz şey, bu token’ların dizide birbirini takip etme olasılıklarını modellemektir. Bunun için, veri kümesinden **token pencereleri** seçeriz. Yani, veri setinden rastgele belirlenen uzunlukta bir token grubu alırız.

Bu pencerenin uzunluğu **0** token'dan başlayarak, belirlediğimiz **maksimum** bir uzunluğa kadar değişebilir. Örneğin, **pratikte** 8.000 token uzunluğunda pencerelerle çalışmak mümkündür. Teorik olarak, token pencerelerinin uzunluğu **rastgele** belirlenebilir, ancak **çok uzun** pencere dizilerini işlemek **hesaplama açısından çok maliyetli** olur. Bu yüzden, **8.000, 4.000 veya 16.000** gibi sınır değerler belirlenir.

Bu örnekte, her şeyin daha iyi anlaşılabilmesi için sadece **ilk dört token’ı** alacağım.

Bu dört token şunlar:  
**Bar, View, In ve Space**  
(Bunlara karşılık gelen token kimlikleri sırasıyla şunlardır: 1234, 5678, 91011, 1213).

Şimdi yapmak istediğimiz şey, dizide **bir sonraki** token’ın ne olacağını tahmin etmektir.

Örneğin, bu dört token’dan sonra **3962** numaralı token geliyor.

Bu dört token’a **bağlam (context)** adı verilir ve bunlar **sinir ağına giriş verisi** olarak beslenir.

---

### Sinir Ağına Girdi ve Çıktı

Şimdi sinir ağının **girdi** ve **çıktısını** anlamamız önemli.

- **Girdi**: **0 ile maksimum belirlenen pencere uzunluğu (örneğin 8.000 token) arasında değişen token dizileri**
- **Çıktı**: **Bir sonraki token’ın olasılık tahminleri**

Kelime dağarcığımızda **100.277** farklı token bulunduğundan, sinir ağımız **tam olarak 100.277 tane çıktı üretecek**.

Bu çıktılar, her bir token’ın bir sonraki sırada yer alma **olasılıklarını** temsil eder.

Ancak, modelin **ilk başta** rastgele başlatıldığını unutmamalıyız. Bu yüzden, eğitimin **başlangıcında** üretilen tahminler **rastgele** olacaktır.

Örneğin, sinir ağı **bu pencere için şu tahminleri yapabilir**:

- "Direction" token’ı: **%4 olasılıkla gelecek**
- "11799" token’ı: **%2 olasılıkla gelecek**
- "3962" (Post) token’ı: **%3 olasılıkla gelecek**

Ancak, biz veri kümesinden aldığımız örnekle **doğru cevabı biliyoruz**. Yani, aslında doğru tahmin **3962** token’ıdır.

Dolayısıyla, sinir ağını **güncelleyerek** doğru cevabın olasılığını **arttırmak**, yanlış tahminlerin olasılığını **azaltmak** istiyoruz.

---

### Sinir Ağını Güncelleme Süreci

Bu noktada, sinir ağımızın ürettiği tahminleri nasıl düzeltebileceğimizi anlamamız gerekiyor.

Eğitim sürecinde, sinir ağına bir pencere token dizisi verildiğinde, **beklenen doğru cevabı** da biliyoruz.  
Bu bilgiyi kullanarak **modelin olasılıklarını nasıl ayarlayacağını hesaplayan matematiksel bir işlem** gerçekleştiriyoruz.

Örneğin:

- İlk tahminde **Post (3962)** token’ı **%3 olasılıkla** tahmin edilmişti.
- Model güncellenip **öğrenmeye başladığında**, aynı pencere tekrar işlendiğinde bu olasılık **%4’e** yükselebilir.
- Diğer yanlış tahminlerin olasılıkları ise **daha da azalacaktır**.

Bu süreç, yalnızca **tek bir pencere için değil**, tüm veri kümesi boyunca **paralel olarak büyük gruplar halinde** gerçekleştirilir.

Sonuç olarak, sinir ağı **bütün bu token pencerelerinden gelen istatistiksel bilgileri kullanarak** güncellenir. Böylece, **hangi token’ların hangi sıklıkla birbirini takip ettiğini daha iyi modellemeye başlar**.

İşte **sinir ağı eğitiminin temeli** budur:  
Modelin **tahminleri**, eğitim setindeki gerçek istatistiksel paternlerle **uyumlu hale getirilene kadar** sürekli olarak güncellenir.

---

Şimdi sinir ağının iç mekanizmalarına **kısaca göz atalım**…

### Sinir Ağı İç Yapısı

Sinir ağlarının iç yapısını anlamanız için içeriğine biraz göz atalım. Daha önce de belirttiğim gibi, bu ağlara verilen girdiler belirli bir sıra ile dizilmiş token (birim) dizileridir. Burada dört giriş token’ı görüyoruz, ancak bu sayı sıfır ile 8.000 arasında herhangi bir değer olabilir. Teorik olarak, sonsuz sayıda token işleyebiliriz; ancak, bu hesaplama açısından çok maliyetli olacağından, belirli bir uzunlukta keserek modelin maksimum bağlam uzunluğunu belirleriz.

Bu girdiler (X), sinir ağının parametreleri ya da ağırlıkları ile birlikte devasa bir matematiksel ifadeye dahil edilir. Burada altı örnek parametre ve bunların belirli değerlerini gösteriyorum, ancak günümüzün modern sinir ağları milyarlarca parametreye sahiptir. Başlangıçta bu parametreler tamamen rastgele belirlenir.

Parametreler rastgele ayarlandığında, sinir ağının tahminleri de rastgele olur. Gerçekten de, başlangıçta ağ tamamen rastgele tahminler üretir. Ancak, bu parametreleri yinelemeli olarak güncelleme süreci sayesinde—ki bu sürece sinir ağını eğitme süreci diyoruz—parametreler, modelin çıktılarının eğitim verilerindeki kalıplarla tutarlı hale gelecek şekilde ayarlanır.

Bu parametreleri bir DJ setindeki düğmeler gibi düşünebilirsiniz. Bu düğmeleri çevirdikçe, her olası token dizisi için farklı tahminler elde edersiniz. Sinir ağı eğitmek, bu düğmeleri öyle bir şekilde ayarlamaktır ki, çıktılar eğitim setinin istatistikleriyle uyumlu hale gelsin.

Şimdi, bu devasa matematiksel ifadenin nasıl göründüğüne dair bir fikir vermek için basit bir örnek paylaşayım. Modern ağlar trilyonlarca terime sahip devasa ifadeler içerir, ancak temel düzeyde şu şekilde işler:

Girdiler (X), örneğin X1​ ve X2​, ağın ağırlıkları (W0​,W1​,W2​,W3​ vb.) ile birleştirilir. Bu birleşim çarpma, toplama, üs alma, bölme gibi temel matematiksel işlemleri içerir. Sinir ağı mimarisi araştırmalarının temel amacı, bu matematiksel ifadeleri optimize edilebilir, paralelleştirilebilir ve etkili hale getirmektir. Ancak, günün sonunda bu ifadeler karmaşık değildir; temelde girdileri parametrelerle birleştirerek tahminler üretir ve bu parametreleri eğitim setine uygun hale getirmek için optimize ederiz.

### Üretim Düzeyinde Bir Sinir Ağı

Şimdi, üretimde kullanılan bir sinir ağı örneği göstermek istiyorum. Bunun için belirli bir web sitesine gitmenizi öneririm; burada bu ağlardan birinin görselleştirilmiş hali bulunuyor.

Bu sinir ağı, üretim ortamlarında kullanılan özel bir yapıya sahiptir ve “Transformer” olarak adlandırılır. Örneğin, bu modelin yaklaşık 85.000 parametresi vardır.

Ağ, üst kısımda token dizilerini girdi olarak alır ve bu bilgiler ağın içinden akarak çıkış tahminlerine ulaşır. Çıkıştaki değerler, belirli bir sonraki token’ın olasılıklarını veren "logit" veya "softmax" sonuçlarıdır.

Burada, bir dizi dönüşüm ve ara değer hesaplaması gerçekleşir. Örneğin, token'lar sinir ağı içinde belirli bir vektör temsiline gömülür (embedded representation). Yani, her olası token, ağ içinde onu temsil eden bir vektör ile gösterilir.

İlk olarak, token'lar gömülür ve ardından değerler ağın farklı bölümlerinden akarak ilerler. Bu işlemler, katman normları (layer normalization), matris çarpımları, softmax işlemleri ve benzeri basit matematiksel ifadeler içerir. Transformer mimarisinin en önemli bileşenlerinden biri olan "dikkat mekanizması" (attention block) devreye girer ve ardından bilgi, çok katmanlı algılayıcı bloğuna (multi-layer perceptron block) ilerler.

Şemadaki sayılar, ağın içindeki ara değerleri temsil eder. Bunları, sentetik nöronların ateşleme oranları (firing rates) gibi düşünebilirsiniz. Ancak, bunları biyolojik nöronlarla doğrudan karşılaştırmamak gerekir. Gerçek nöronlar çok daha karmaşık ve dinamik süreçlere sahiptir, belleğe sahiptirler ve biyokimyasal süreçler tarafından yönetilirler. Öte yandan, sinir ağındaki bu yapılar tamamen matematiksel ve belirli bir girdiye karşılık belirli bir çıktıyı üreten "stateless" (durumsuz) sistemlerdir.

Bu ağı, sentetik bir beyin dokusu gibi düşünebilirsiniz, ancak biyolojik beyinle aynı değildir. Burada, bilgiler nöronlar boyunca akar ve tahminlere ulaşana kadar işlenir.

Son olarak, ağın içindeki dönüşümlerin matematiksel ayrıntılarına çok fazla girmeyeceğim, çünkü asıl önemli olan şudur:

- Bu, belirli sayıda parametre ile tanımlanmış bir matematiksel fonksiyondur.
- Girdi verilerini çıktıya dönüştüren bir yapıdadır.
- Parametreler değiştirildikçe, tahminler de değişir.
- Amacımız, parametreleri öyle bir ayarlamaktır ki, ağın tahminleri eğitim setindeki desenlerle uyumlu olsun.

İşte Transformer budur. Böylece, sinir ağının iç yapısını ve eğitilme sürecini ele almış olduk.

---

### Çıkarım (Inference)

Sinir ağının iç yapısını inceledik ve onu eğitme sürecinden bahsettik. Şimdi bu ağlarla çalışırken önemli olan bir diğer aşamaya geçmek istiyorum: **çıkarım (inference)**.

Çıkarım sürecinde, modelden yeni veriler üretiriz. Esasen, modelin parametrelerinde içselleştirdiği kalıpları görmek isteriz. Modelden çıktı üretmek oldukça basittir: Başlangıçta bir dizi token ile süreci başlatırız. Bu token’lar, üretilecek içeriğin ön ekidir.

Örneğin, başlangıç olarak **"91"** token’ı ile başlamak isteyelim. Bu token’ı modele beslediğimizde, model bize olasılık dağılımı içeren bir çıktı döndürür. Model, belirli token’ların ortaya çıkma olasılıklarını verir.

Bu noktada, modelin tahmin ettiği olasılık dağılımına dayalı olarak bir token seçebiliriz. Bunu **"ön yargılı bir para atışı"** gibi düşünebilirsiniz. Yani, modelin yüksek olasılık verdiği token’lar daha sık seçilecektir. Olasılık dağılımından bir token örneklediğimizde, örneğin **"860"** token’ını elde edebiliriz. Bu token, modelin yüksek olasılık verdiği bir çıktı olabilir ama tek olası seçenek değildir. Başka token’lar da seçilebilirdi.

Şimdi bu süreci bir adım daha ilerletelim:

- **"91"** token’ını girdik, **"860"** token’ını ürettik.
- Şimdi bu iki token’ı birlikte modele geri veriyoruz ve üçüncü token’ı örnekliyoruz. Diyelim ki bu **"287"** oldu.
- Ardından, bu üçlü diziyi modele veriyoruz ve dördüncü token’ı seçiyoruz.
- Bu süreci tekrar ederek, her adımda yeni token’lar örnekleyerek bir dizi oluşturuyoruz.

Burada önemli olan nokta, modelin **stokastik** (olasılıklı) doğasıdır. Her adımda farklı bir token seçme ihtimali vardır. Bazen, eğitim verilerinde bulunan bir diziyi tam olarak yeniden üretebiliriz, ancak çoğu zaman model, eğitim verilerinde birebir bulunmayan ancak onlardan "esinlenmiş" yeni diziler oluşturur.

Örneğin, başlangıç olarak **"bar", "viewing", "single"** kelimelerini verdik diyelim. Eğitim verilerinde bu diziyi takip eden kelimenin sıklıkla **"article"** olduğu görülmüşse, model bu kelimeyi seçebilir. Ancak, **tamamen farklı bir kelime de seçilebilir**. Bu nedenle, modelin ürettiği metinler eğitim verileriyle birebir aynı değildir; **istatistiksel olarak benzer özelliklere sahip, ancak orijinal verilerden türetilmiş yeni dizilerdir**.

### Eğitimden Sonra Çıkarım

Çıkarım süreci, eğitimin tamamlanmasının ardından gerçekleşir. Ön işleme aşamasında, internetten veri toplanır ve token’lara ayrılır. Bu token dizileri, birçok farklı yapı ve büyüklükte sinir ağlarını eğitmek için kullanılır.

Bir model eğitildiğinde ve belirli bir parametre kümesi ile tatmin edici bir performans elde edildiğinde, bu model artık **çıkarım yapmaya hazırdır**. Örneğin, ChatGPT ile konuştuğunuzda, aslında eğitilmiş bir modelle etkileşime giriyorsunuz. OpenAI, bu modeli aylar önce eğitti ve belirli bir parametre seti belirledi. Siz modele bir şey sorduğunuzda, artık **yeni bir eğitim yapılmıyor**, sadece **çıkarım süreci** çalışıyor.

Bu aşamada model, ona verilen giriş token’larını tamamlayarak yanıtlar üretir. Çıkışlar tamamen modelin ağırlıklarına ve eğitim sürecinde öğrendiği kalıplara dayanır. Ancak, model sabitlenmiş parametrelerle çalıştığı için yeni bir eğitim yapılmaz; sadece eğitilmiş ağırlıkları kullanarak yanıt oluşturur.

---

### **GPT-2: Eğitim ve Çıkarım Süreci**

Şimdi, eğitim ve çıkarım sürecini daha somut bir şekilde göstermek için OpenAI’nin GPT modellerinden birini ele alalım.

**GPT** (Generatively Pre-trained Transformer), "Üretici Ön Eğitimli Dönüştürücü" anlamına gelir ve bu, OpenAI tarafından geliştirilen GPT serisinin ikinci versiyonudur (yenilemesidir). Bugün ChatGPT ile konuştuğunuzda, o etkileşimin altında yatan model GPT-4’tür, yani serinin dördüncü neslidir.

GPT-2, 2019 yılında OpenAI tarafından yayınlanan şu elimde tuttuğum makalede tanıtılmıştır. GPT-2’yi özellikle ilginç bulmamın sebebi, ilk kez modern yapay zeka modellerinin temellerini oluşturan bir yapının ortaya çıkmasıdır. Bugün kullandığımız modellerin bileşenlerinin çoğu, GPT-2’de zaten mevcuttu; tek fark, artık her şeyin çok daha büyük olması.

Bu makalenin tüm teknik detaylarına giremeyeceğim, çünkü oldukça kapsamlı bir akademik çalışma. Ancak, öne çıkan bazı önemli noktaları vurgulamak istiyorum:

- GPT-2 de günümüzdeki modern modeller gibi bir **Dönüştürücü Sinir Ağı**ydı.
- **1,6 milyar parametreye** sahipti. Günümüzdeki Transformer modelleri ise **yüzlerce milyar veya trilyonlarca** parametreye ulaşmış durumda.
- **Maksimum bağlam uzunluğu (context length) 1.024 token** idi. Yani model, bir tahmin yaparken en fazla 1.024 token uzunluğundaki bir pencere içinde işlem yapabiliyordu. Oysa bugün bu sınır **yüz binlerce, hatta milyonlarca** token seviyesine ulaştı.
- **100 milyar token ile eğitildi.** Günümüz standartlarına göre bu oldukça küçük bir veri seti. Örneğin, şu an incelediğimiz "Fine Web" veri seti **15 trilyon token** içeriyor.

Eğlence amaçlı olarak GPT-2’yi yeniden üretmeye çalıştım ve bunu **LM.C** adlı projede GitHub üzerinden paylaştım. 2019’da GPT-2’nin eğitilmesi **yaklaşık 40.000 dolar** olarak hesaplanıyordu. Ancak günümüzde bu maliyetler ciddi şekilde düştü. Örneğin, benim gerçekleştirdiğim denemede **sadece 600 dolar ve bir gün içinde** benzer bir modeli eğitebildim. Hatta daha fazla optimizasyon yaparak bu maliyeti **100 dolara kadar** düşürmek bile mümkün.

Peki, maliyetler neden bu kadar düştü?

- Birincisi, veri setleri çok daha iyi hale geldi. Filtreleme, veri çıkarma ve işleme yöntemleri oldukça gelişti.
- Ancak en büyük fark, **bilgisayarların çok daha hızlı hale gelmesi.** Hem donanım hem de yazılım tarafında büyük ilerlemeler kaydedildi. Artık modelleri çok daha verimli çalıştırabiliyoruz.

GPT-2’yi yeniden üretme sürecini tamamen detaylandıramayacağım, çünkü oldukça teknik bir konu. Ancak, bu tür bir modeli eğitirken bir araştırmacının nasıl bir süreç izlediğine dair genel bir fikir vermek istiyorum.

### GPT-2 Eğitimi Nasıl Görünüyordu?

Şu an ekranımda bir GPT-2 modeli eğitiyorum. Burada gördüğünüz her satır, modele yapılan **bir güncelleme adımını** temsil ediyor. Hatırlarsanız, modelin amacı her adımdan sonra bir sonraki token’i daha iyi tahmin edebilmekti. Her güncelleme adımıyla sinir ağının parametreleri iyileştiriliyor.

Her bir satır şu işlemi temsil ediyor:

- **1 milyon tokenlik bir eğitim kümesi** alınıyor.
- Model, bu token’lerin bir sonraki kelimesini tahmin etmeye çalışıyor.
- Doğru tahmin yapabilmesi için sinir ağının parametreleri güncelleniyor.

Burada en önemli metriklerden biri **"loss" (kayıp) değeridir.** Kayıp değeri, modelin ne kadar iyi performans gösterdiğini belirten tek bir sayıdır. **Daha düşük kayıp daha iyi bir model anlamına gelir.** Aşağı doğru eğilim göstermesi beklenir; yani her güncelleme adımı modelin daha iyi hale geldiğini gösterir.

Örneğin:

- Şu an **her güncelleme yaklaşık 7 saniye** sürüyor.
- **Toplamda 32.000 güncelleme adımı** yapacağız.
- **Her adımda 1 milyon token işlediğimiz için toplamda 32 milyar token işlemiş olacağız.**

Şu anda **420. adıma** geldik, yani eğitimin **sadece %1’i tamamlanmış durumda.** Bu nedenle model hâlâ oldukça kötü performans gösteriyor.

Örneğin, şu an ürettiği metin şu şekilde:  
*"Since she is mine, it's a part of the information should discuss my father great companions Gordon showed me sitting over at..."*

Bu metin **anlamsız görünüyor.** Ancak, model eğitimin başında tamamen rastgele çıktılar üretiyordu. Birkaç saat sonra, 32.000 adım tamamlandığında, model çok daha akıcı ve mantıklı metinler oluşturabilecek hale gelecek.

### Model Eğitimi İçin Kullanılan Bilgisayarlar

Tabii ki, bu modeli **kendi dizüstü bilgisayarımda eğitmiyorum.** Bunun için çok büyük miktarda hesaplama gücü gerekiyor. Bu nedenle, tüm eğitim süreci **bulutta (cloud) çalışan güçlü bir bilgisayar kümesinde** gerçekleştiriliyor.

Bu eğitimi şu donanımla yapıyorum:

- **8 adet Nvidia H100 GPU içeren bir sunucu.**
- Bu sunucu, bir bulut sağlayıcısından kiralandı (ben Lambda Labs’i tercih ettim, ancak başka birçok sağlayıcı mevcut).
- **1 H100 GPU, saatlik yaklaşık 3 dolara** kiralanabiliyor.
- 8 H100 GPU’dan oluşan bir sunucu **saatlik yaklaşık 24 dolara mal oluyor.**

Bu GPU’lar **paralel hesaplama için mükemmel bir uyum sağlar.** Çünkü sinir ağlarının eğitiminde **milyarlarca matris çarpımı** gerçekleştirilir ve GPU’lar tam olarak bu tür hesaplamalar için optimize edilmiştir.

Örneğin:

- **1 GPU → 8 GPU → 1 Sunucu → Çoklu sunucular → Veri merkezleri.**
- Büyük teknoloji şirketleri **devasa veri merkezleri kurarak** bu işlem gücünü büyük ölçekte kullanıyor.

Bu donanımların önemi, Nvidia’nın piyasa değerine bile yansımış durumda. Şu an Nvidia’nın toplam piyasa değeri **3,4 trilyon dolar.** Bunun nedeni, büyük teknoloji şirketlerinin **yapay zeka modellerini eğitmek için bu GPU’lara yoğun şekilde yatırım yapması.**

Örneğin, geçtiğimiz ay çıkan bir habere göre Elon Musk, **100.000 adet Nvidia GPU içeren devasa bir veri merkezi kuruyor.** Bu GPU’lar **milyonlarca dolar maliyet gerektiriyor** ve **muazzam enerji tüketiyor.** Ancak tüm bu sistemlerin yaptığı tek şey şu: **Bir sonraki token’i tahmin etmek.**

Ne yazık ki, elimde **milyonlarca dolarlık** bir bütçe olmadığı için GPT-4 veya benzeri büyük modelleri **sıfırdan eğitmem mümkün değil.** Ancak, büyük teknoloji şirketleri **bu modelleri eğittikten sonra bazen halka açıyor.**

Örneğin:

- **Meta’nın Llama 3.1 modeli** gibi bazı açık kaynak seçenekler mevcut.
- **OpenAI, Google, Anthropic gibi firmalar** bazı modelleri API olarak kullanıma sunuyor.

Böylece, bireysel geliştiriciler ve araştırmacılar bu modelleri **sadece çıkarım (inference) sürecinde kullanarak** büyük yapay zeka projeleri geliştirebiliyor.

# Llama 3.1 Base Model Çıkarımı (Inference)

Büyük bir modelin eğitimine harcanan devasa hesaplama gücü sayesinde, bu tür modelleri rutin olarak eğiten büyük teknoloji şirketlerine başvurabiliyoruz. Bu şirketler, modelleri eğittikten sonra yayınlayarak, optimizasyon sürecinde harcadıkları hesaplama kaynaklarını değerlendiriyorlar. Böylece, eğitim tamamlandığında ortaya çıkan **base model**'i kullanmak mümkün oluyor. Ancak, birçok şirket bu modelleri eğitirken, yayınlanan model genellikle yalnızca ilk adım olan base model aşaması oluyor.

## Base Model Nedir?

Base model, temelde bir **token simülatörü**dür; internetteki metinlerin token’larını taklit eden bir yapıdır. Fakat bu model tek başına pek kullanışlı değildir çünkü asıl istediğimiz şey, sorular sorup cevap alabileceğimiz bir **asistan** modelidir. Mevcut base modeller, internetteki verilerden elde ettikleri istatistiksel kalıpları yeniden karıştırarak, internette var olan metinlerin “rüya” gibi kopyalarını üretirler. Bu sebeple, base modeller genellikle daha sonraki adımların yalnızca ilki olarak yayınlanır.

> **Örnek:**  
> 2019 yılında yayınlanan **GPT-2** modeli, yaklaşık **1.5 milyar** parametreye sahiptir (başlangıçta 1.6 milyar olarak bahsedilmişti) ve bu model de bir base model örneğidir.

---

## Model Yayını Nasıl Gerçekleşir?

Bir modeli yayınlamak için iki temel bileşene ihtiyaç vardır:

1. **Python Kodu:**  
   Modelin çalışma sürecindeki adımları detaylı olarak tanımlayan koddur. Örneğin, Transformer mimarisinde sinir ağında gerçekleşen **forward pass** (ileriye doğru geçiş) bu kodla uygulanır. Genellikle birkaç yüz satırlık, anlaşılması kolay ve standart bir koddur.

2. **Parametreler:**  
   Sinir ağının gerçek “değerleri” olan parametrelerdir. Bir modelin milyonlarca, hatta milyarlarca parametresi bulunur; bu parametreler, token’ların doğru şekilde üretilmesi için ayarlanmıştır. Dolayısıyla, kaynak kodla birlikte yaklaşık 1.6 milyar parametre listesi de (GPT-2 yi oluşturan 1.6 milyar adetlik bir sayı listesi gibi düşünün) yayınlanır.

Bu iki bileşenin bir araya gelmesiyle bir **base model** ortaya çıkar.

---

## Llama 3: Daha Modern ve Büyük Bir Model

GPT-2 eski bir modelken, asıl odaklanmamız gereken model **Llama 3**’tür.

- **GPT-2:** Yaklaşık 1.6 milyar parametre, 100 milyar token üzerinde eğitilmiştir.
- **Llama 3:** Meta tarafından eğitilen, **405 milyar parametreye** sahip ve **15 trilyon token** üzerinde eğitilmiş çok daha büyük ve modern bir modeldir.

Meta ayrıca, detaylı bir makale eşliğinde **Llama 3**’ün yayınını gerçekleştirmiştir. Bu makalede en büyük base model olarak **Llama 3.1 405 milyar parametre**'lik model sunulmuştur.

Ek olarak, videonun ilerleyen bölümlerinde değinilecek olan **instruct model** de yayınlanmıştır. *Instruct* modeli, kullanıcıların sorularını yanıtlayan bir asistan modelidir. Şimdilik, yalnızca bu base model (token simülatörü) üzerinden ilerleyeceğiz.

---

## Base Model ile Deney Yapmak

Base modelin nasıl çalıştığını anlamak için onu deneyimleyebileceğimiz birkaç nokta bulunmaktadır. Benim en sevdiğim etkileşim platformlarından biri, **Hyperbolic** adlı şirkettir. Bu şirket, **405 milyar parametreli Llama 3.1 base model**’ini hizmete sunmaktadır. Web sitesine giriş yaptıktan sonra (kayıt olmanız gerekebilir), modeller arasından **"Llama 3.1 405 milyar base"** modelini seçtiğinizden emin olun.

### Model Parametre Ayarları

- **Max Tokens:** Üreteceğimiz token sayısını belirler. Hesaplama israfını önlemek için bunu, örneğin yalnızca sonraki 128 token’ı üretecek şekilde ayarlayabiliriz.

Temel olarak, model girdiğiniz *ön ek (prefix)* token dizisini devam ettirir. Ancak şunu belirtmek gerekir:  
**Bu model henüz bir asistan değildir.** Örneğin, "2 artı 2 kaç eder?" diye sorduğunuzda, model “dört” diyerek yanıt vermez; bunun yerine, bu ifadeyi token’lara bölerek, yalnızca otomatik tamamlama (autocomplete) işlemi gerçekleştirir.

### Stokastik (Rastlantısal) Yapı

Modelin ürettiği cevaplar her çalıştırmada farklılık gösterebilir. Bunun nedeni, modelin aynı ön ek için bile olasılık dağılımından örnekleme yaparak her seferinde farklı token dizileri üretmesidir. Yani:

- **İlk olarak:** Model bir asistan değil, sadece bir token otomatik tamamlama sistemidir.
- **İkinci olarak:** Model stokastiktir; aynı giriş için farklı sonuçlar üretebilir.

---

## Modelin Öğrendiği Bilgi ve Bellek Yönetimi

Model, sonraki token’ı tahmin etme görevi sayesinde, dünyayla ilgili geniş bir bilgi birikimini parametrelerine kaydeder. İnternetten alınan belgeler, küçük metin parçacıklarına (token) ayrılır ve model, bu token dizilerini öğrenerek bilgiyi sıkıştırır.

**405 milyar parametre** İnterneti sıkıştırmak gibidir. Bir tür zip dosyası gibi düşünülebilir; fakat bu sıkıştırma **kayıplı** bir süreçtir.

Bu bilgi, uygun prompt’lar kullanılarak ortaya çıkarılabilir. Örneğin:

> **Prompt Örneği:**  
> *"Paris'te gezilmesi gereken en iyi 10 önemli yer listem:"*

Bu tür bir prompt, modelin parametrelerinde saklı bilgileri ortaya çıkarır. Ancak unutulmamalıdır ki; modelin bilgisi internette sıkça bulunan ve dolayısıyla daha doğru hatırlanan örneklerden oluşur. Nadir görülen bilgiler için modelin yanıtları belirsiz ve yaklaşık olacaktır.

---

## Bellekten Tekrar Üretim (Regurgitasyon) Örneği

Modelin hafızasındaki bilgiyi doğrudan nasıl tekrarladığını görmek için bir örnek verelim.

- **Örnek:** Wikipedia’daki zebra (zebra) sayfasından bir cümleyi kopyalayıp modele verdiğinizde, model bu cümleyi neredeyse kelimesi kelimesine yeniden üretebilir.
- Model, yüksek kaliteli kaynaklar (örneğin Wikipedia) eğitim sırasında defalarca örnek almışsa, bu belgeleri hatırlaması oldukça olasıdır.

Bu durum genellikle istenmeyen bir davranıştır, çünkü modelin eğitim aldığı belgeleri **doğrudan tekrarlaması** (regurgitasyon) arzu edilmez.

---

## Geleceğe Dair Bilgiler Üretme: Hallusinasyon

Modelin eğitim verisinin kesim tarihi 2023 sonu olduğundan, 2024 seçimleri gibi gelecekteki olaylara dair bilgisi bulunmaz. Eğer modele, geleceğe dair token’lar içeren bir prompt verilirse, model bu diziyi en iyi tahminine göre tamamlamaya çalışır.

- **Örnek Senaryo:**
  
  > "Cumhuriyetçi Parti, Trump... 2017’den itibaren ABD Başkanı..."  
  > Model, burada çalışma arkadaşı, rakip gibi unsurları tahmin edecektir. Bir örnekte, model “Mike Pence’in çalışma arkadaşı olduğunu” söylerken, başka bir örnekte “Ronda Santis” diyerek farklı bir evreni betimleyebilir.  
  > Bu tür yanıtlar, modelin **hallusinasyon** yapması olarak adlandırılır; yani model, olasılıksal olarak en iyi tahmini yapmaktadır.

---

## Few-Shot Prompt ile Uygulama Geliştirme

Base model henüz tam bir asistan model değilse de, akıllı prompt tasarımı ile pratik uygulamalarda kullanılabilir.  
**Few-shot prompt** yöntemiyle, örneğin, 10 çift İngilizce kelime ve bunların Korece çevirileri verilir. Listenin sonunda, “teacher” sütununda tamamlanması gereken token’lar bırakılır. Model, bu bağlamı okudukça in-context learning (bağlam içinde öğrenme) yaparak kalıbı devam ettirir ve doğru çeviriyi üretir.

Bu yöntem, yalnızca base model kullanılarak uygulama geliştirme konusunda güçlü bir örnek teşkil eder.

---

## Sadece Prompt ile Dil Modeli Asistanı Oluşturma

Bir başka ilginç yöntem, yalnızca prompt kullanarak tam işlevsel bir dil modeli asistanı oluşturabilmektir. Buradaki hile, prompt’u, faydalı bir yapay zeka asistanı ile insan arasındaki konuşma şeklinde yapılandırmaktır.  
Örneğin, ChatGPT’ye şunu söyleyebilirsiniz:

> "Ben bir LLM asistanı oluşturmak istiyorum, ancak elimde sadece base model var. Lütfen asistan prompt’umu yazabilir misin?"

ChatGPT, aşağıdakine benzer bir prompt önerecektir:

> **Konuşma Örneği:**
> 
> - **AI Asistanı:** Bilgili, yardımsever ve geniş bir yelpazede soruları yanıtlayabilir.
> - **İnsan:** *[Sorgu buraya gelecek]*

Bu yapı sayesinde, model kendisini bir asistan gibi konumlandırır ve girilen sorguya yanıt verir. Örneğin,  
**İnsan:** "Gökyüzü neden mavi?"  
**Asistan:** "Gökyüzünün mavi görünmesi, Rayleigh saçılması adı verilen bir fenomene bağlıdır..."  
Model, bu şekilde konuşmayı sürdürebilir. Ancak, bazen model asistanın konuşmasını tamamlayıp ardından yeni sorular üretebilir; yine de bu yöntem, yalnızca base model kullanarak bir asistan oluşturmanın etkili yollarından biridir.

---

## Genel Değerlendirme ve Özet

Şu ana kadar, **ön eğitim (pre-training)** aşamasından **son eğitim (post-training)** aşamasına kadar dil modeli asistanlarının eğitilme sürecinde ele alınan temel noktaları inceledik. Özetle:

- İnternetten alınan belgeler, küçük metin parçacıklarına (token) ayrılır.
- Sinir ağları, bu token dizilerini tahmin ederek eğitim sürecini gerçekleştirir.
- Bu süreç sonucunda elde edilen model, sinir ağının parametre ayarlarını içeren **base model**’dir.
- Base model, doğrudan bir asistan işlevi görmese de, doğru prompt’lar ile bilgiyi ortaya çıkarma, in-context learning ve hatta tam işlevsel asistan sistemleri oluşturma imkanı sunar.

Bu base model, temelde token seviyesinde bir internet belge simülatörüdür; yani internetteki belgelerin istatistiksel özelliklerine sahip token dizilerini üretebilir. Bazı uygulamalarda kullanılabileceğini gördük, fakat asıl ihtiyacımız asistan modelidir; sorular sorabilmek ve modelin bize cevap verebilmesidir.

Bu yüzden artık ikinci aşamaya, **son eğitim (post-training)** aşamasına geçmemiz gerekiyor. Burada base modelimiz, yani internet belge simülatörümüz, son eğitim için kullanılır. Şimdi, modellerin son eğitim aşamasını yapmanın birkaç yolunu tartışacağız. Bu aşamadaki hesaplama maliyetleri, ön eğitimde kullanılan devasa veri merkezleri, ağır hesaplama kaynakları ve milyonlarca dolarlık yatırımla kıyaslandığında çok daha düşüktür. Yine de son eğitim aşaması, bu dil modeli (LLM) modelini asistan haline getirmek açısından son derece önemlidir.

## Son Eğitim (Post Training)

**Hedef:**  

Modelin, internetteki belgeleri örneklemek yerine, sorulara cevap verebilmesini sağlamak.

Bunun için artık **konuşmalar (conversations)** üzerine yoğunlaşmamız gerekiyor. Bu konuşmalar çok turlu (multi-turn) olabilir; yani en basit haliyle bir insan ile asistan arasındaki diyalogu içerir. Örneğin:

- **Örnek 1:**
  - **İnsan:** "2 artı 2 kaç eder?"
  - **Asistan:** "2 artı 2, 4 eder."
- **Örnek 2:**
  - **İnsan:** "Peki, artı yerine çarpı olsaydı ne olurdu?"
  - **Asistan:** (Farklı bir cevap vererek durumu yorumlar.)
- **Örnek 3:**
  - **İnsan:** (Asistanın yardım etmesini istemediğimiz bir konuda soru sorarsa)
  - **Asistan:** (Yardım edemeyeceğini belirten bir reddetme ifadesi verir.)

Bu örnekler, asistanın insanla nasıl etkileşimde bulunması gerektiğini, davranışının nasıl şekillenmesi gerektiğini göstermektedir. Ancak, sinir ağlarıyla çalıştığımız için asistanın davranışını açıkça kod yazarak programlayamayız; her şey, verisetleri üzerinde sinir ağı eğitimiyle gerçekleşir. Dolayısıyla, asistanı **örneklerle (by example)** programlayacağız. Bu amaçla, konuşma örneklerinden oluşan verisetleri oluşturuyoruz.

> **Not:** Gerçek verisetleri, yüz binlerce, hatta milyonlarca çok turlu konuşmayı içerebilir; burada sadece üç örnek gösteriyoruz.

Verisetindeki her örnek, ideal asistan yanıtını içermektedir. Peki bu veriler nereden geliyor?  

Cevap: **İnsan etiketleyicilerden (human labelers)**. İnsan etiketleyicilere, belirli bir konuşma bağlamı verilir ve onlardan ideal asistan yanıtını üretmeleri istenir. Böylece, model bu örneklerden öğrenerek insan etiketleyicilerin vereceği yanıtları taklit etmeye başlar.

Özetle, ön eğitimde oluşturduğumuz ve internet belgeleri üzerinde eğittiğimiz base modelimizi artık konuşmalardan oluşan yeni bir verisetine göre son eğitim aşamasında tekrar eğiteceğiz. Model, insan sorgularına nasıl yanıt vermesi gerektiğinin istatistiklerini çok hızlı bir şekilde öğrenecek. Sonrasında, gerçek kullanım (inference) sırasında asistanı doğru şekilde "prime" edip, ideal yanıtları üretebilecektir.

## Son Eğitim Aşamasının Süresi ve Yöntemi

- **Ön Eğitim:** Binlerce bilgisayarda yaklaşık üç aylık yoğun eğitim gerektirebilir.
- **Son Eğitim:** Çok daha kısa sürede, örneğin yaklaşık 3 saat gibi bir sürede tamamlanabilir.  
  Bunun nedeni, internet metinlerinden oluşan devasa verisetine kıyasla, konuşma verisetlerinin çok daha küçük olmasıdır.

Temelde, aynı algoritmayı kullanarak base modelin eğitimi devam ettirilir; tek fark, veri setini **konuşma verisetleriyle** değiştirmiş olmamızdır.

## Konuşmaların Tokenizasyonu

Her şeyin token dizilerine dönüştürülmesi gerekmektedir, çünkü modelimiz tamamen token dizileriyle çalışır. Peki, **konuşmaları** nasıl token dizilerine dönüştüreceğiz? Bunun için belirli kodlama (encoding) ve çözme (decoding) kuralları tasarlamalıyız. Bu durum, internet üzerindeki TCP/IP paketlerinin nasıl belirli kurallarla yapılandırıldığına benzer; yani verinin kağıda yazılıp herkesin anlayabileceği belirli protokolleri vardır.

Benzer şekilde, LLM’lerde de konuşma verilerinin nasıl kodlanıp çözüleceğini belirleyen veri yapıları ve kurallara ihtiyaç vardır. Örneğin, bir **Tech Tokenizer** aracını kullanarak, iki turlu (user ve assistant arasında) bir konuşmanın token dizisine nasıl dönüştüğünü görebiliriz. Bu dönüşüm, görünüşte karmaşık olsa da temel olarak şöyle işler:

- Konuşma, **kullanıcı** ve **asistan** arasında iki turlu bir diyalog olarak ele alınır.
- Sonuçta, bu konuşma 49 token içeren tek boyutlu bir diziye dönüştürülür.
- Farklı LLM’ler, benzer işleyişi farklı formatlarda uygularlar. Örneğin, **GPT-4**'te şu özel token’lar kullanılır:
  - **IM_START:** (IM, “imaginary monologue” yani hayali monologun başlangıcı anlamına gelir; neden bu şekilde adlandırıldığı tam olarak bilinmese de)
  - Ardından, kimin sırası olduğunun belirtilmesi (örneğin, **USER** token’ı)
  - **Internal monologue separator**
  - Kullanıcının sorusunun token’ları
  - **IM_END:** (Hayali monologun sonu)

Burada önemli olan, **IM_START** gibi özel token’ların metin olarak değil, modelin son eğitim aşamasında tanıtılan, tamamen yeni token’lar olduğudur. Bu özel token’lar, metinle iç içe geçecek şekilde eklenir ve modelin "bu, kullanıcının turunun başlangıcı" veya "bu, asistanın yanıtı" gibi bilgileri öğrenmesini sağlar.

Sonuç olarak, yapısal olarak düşündüğümüz konuşmalar, uygun kodlama ile tek boyutlu token dizilerine dönüştürülür. Artık bu diziler üzerinde daha önce uyguladığımız tüm teknikler kullanılabilir; model, sıradaki token’ı tahmin etmeye çalışır. Böylece konuşmalar da eğitilebilir hale gelir.

## Test Zamanında (Inference) Konuşma Akışı

Modeli konuşma verisetleriyle eğittikten sonra, test zamanında (inference) ne olur?  
Örneğin, bir sohbet arayüzünde (ChatGPT gibi) bir diyalog gerçekleştirildiğinde:

1. **Önceden doldurulmuş diyalog:**
   - **Örnek:** "2 artı 2 kaç eder? — 2 artı 2, 4 eder."
2. Sonrasında kullanıcı yeni bir ifade ekler:
   - **Örnek:** "Peki, çarpı olsaydı?"
3. Arka planda, OpenAI sunucuları özel token’lar ekleyerek (örneğin, **I_START**, **ASSISTANT**, **IM_END** gibi) bu konuşma bağlamını oluşturur ve modelden sonraki token’ları tahmin etmesini ister.
4. Model, ilk token’dan başlayarak uygun bir yanıt üretir; bu yanıt, eğitim verisetindeki konuşma kalıplarının istatistiklerini yansıtır.

Detayların önemi yok; önemli olan, tüm verinin tek boyutlu token dizilerine indirgenebildiği ve bu şekilde eğitimin gerçekleştirilebildiğidir.

---

## Gerçek Verisetlerinin İncelenmesi: InstructGPT Örneği

Şimdi, pratikte bu verisetlerinin nasıl göründüğüne değinelim. İlk örnek, **2022'de OpenAI tarafından yayınlanan "InstructGPT"** adlı makaledir. Bu makale, dil modellerinin nasıl konuşmalar üzerinde ince ayar (fine-tuning) yapılabileceğini ilk kez açıklamıştır. Makalenin detaylarından bazılarına bakalım:

### İnsan Etiketleyiciler (Human Labelers) ve Verisetleri

- **Etiketleyici Görevi:**  
  İnsan etiketleyiciler, belirli bir konuşma bağlamında uygun **promt** (sorgu) oluşturur ve ideal asistan yanıtını yazarlar.
  
  - Örneğin:
    - "Kariyerime olan heyecanımı yeniden kazanmak için beş fikir listele."
    - "Sonraki okumam gereken en iyi 10 bilim kurgu kitabı hangileri?"
    - "Bu cümleyi İspanyolcaya çevir." gibi çeşitli örnekler.

- **Nasıl Belirlenir?**  
  
  Etiketleyicilere, ideal asistan yanıtlarını oluşturabilmeleri için **etiketleme yönergeleri (labeling instructions)** verilir.
  
  - Bu yönergelerde, insanların **yardımcı, doğru ve zararsız** olmaları istenir.
  - Bu yönergeler, genellikle yüzlerce sayfa uzunluğunda olup profesyonelce incelenir.

- **Verisetinin Oluşturulması:** 
  OpenAI, bu yönergeleri temel alarak insan etiketleyiciler tarafından oluşturulan konuşma verisetlerini toplar.
  
  - **Not:** InstructGPT verisetleri resmi olarak yayınlanmamıştır, ancak açık kaynaklı projeler (örneğin, Open Assistant) benzer yaklaşımlarla kendi verisetlerini oluşturmuşlardır.

### Eğitim Sürecinde Ne Olur?

Eğitim sırasında, model tüm olası soruları kapsayamaz; ancak yeterli sayıda örnek verildiğinde, model ideal asistanın davranış kalıplarını öğrenir. Yani:

- Model, **yardımcı, doğru, zararsız** bir asistanın istatistiksel kalıplarını benimser.
- Eğitilen model, benzer bir soruyla karşılaştığında, eğitim verisetinde yer alan yanıtın ruhunu yansıtan bir cevap üretecektir.
- Elbette, bazı durumlarda model tam olarak eğitim verisetindeki yanıtı tekrarlayabilir, fakat genellikle benzer bir "vibe" yakalayıp uygun yanıtlar verir.

### Günümüzdeki Gelişmeler

Son 2-3 yılda, insan etiketleyicilerin yaptığı işlerin tamamı tek başına yürütülmemektedir. Artık dil modelleri, bu verisetlerinin oluşturulmasında da yardımcı olmaktadır. Örneğin:

- Mevcut LLM’ler, sıfırdan yanıt yazmak yerine, bir taslak oluşturup insan tarafından düzenlenebilecek yanıtlar üretmektedir.
- **Ultra Chat** gibi modern verisetleri, büyük ölçüde sentetik (yapay) veriler içerse de, belirli oranda insan müdahalesiyle düzenlenmektedir.
- Bu verisetleri, milyonlarca konuşmayı kapsayacak şekilde genişlemiş ve çeşitli alanlardan örnekler içermektedir.

### ChatGPT ile Etkileşimde Gerçeklik

ChatGPT ile konuşurken, aslında istatistiksel olarak **insan etiketleyicileri** taklit eden bir sistemle etkileşimde bulunuyorsunuz. Yani:

- ChatGPT’den aldığınız cevap, aslında şirketler tarafından belirlenen etiketleme yönergelerini takip eden, eğitilmiş insan etiketleyicilerin vereceği yanıtların istatistiksel simülasyonudur.
- Örneğin, Paris’te görülmesi gereken beş önemli yer sorusuna verilecek yanıt, OpenAI’nin verisetinde yer alan ideal yanıtın bir simülasyonu olacaktır.

Bu nedenle, ChatGPT ile etkileşim kurarken, aslında “büyülü bir yapay zeka” ile değil, uzman insan etiketleyicilerin (ya da onların simülasyonunun) yanıtlarını alıyormuşsunuz gibi düşünebilirsiniz.

> **Örnek:** 
> "Paris’te görülmesi gereken en iyi beş simge yapıyı öner." 
> Bu soruya verilen yanıt, OpenAI’nin verisetinde yer alan ideal asistan yanıtını, istatistiksel olarak taklit edecektir.  
> İnsan etiketleyiciler, internetten araştırma yapıp 20 dakika süren çalışmalar sonucunda bu yanıtı oluşturmuş olabilir.

---

Bu uzun açıklama, arka planda neler olduğunu, modelin nasıl eğitildiğini, son eğitim aşamasında ne tür verisetlerinin kullanıldığını ve ChatGPT ile etkileşimde ne tür mekanizmaların devrede olduğunu detaylı olarak ortaya koymaktadır. Kısacası, eğitim verisetleri ve etiketleme yönergeleri sayesinde model, istatistiksel olarak **yardımcı, doğru ve zararsız** bir asistan haline gelir; ve siz de bu modelle etkileşime girdiğinizde, neredeyse gerçek bir insan etiketleyicinin yanıtını alıyormuşsunuz gibi bir deneyim yaşarsınız.

---

# LLM Psikolojisi: Halüsinasyonlar, Araç Kullanımı ve Bilgi/Çalışma Belleği

Bu derste, **LLM (Large Language Model) psikolojisi** olarak adlandırabileceğimiz konulara değinmek istiyorum. Özellikle, bu modellerin **eğitim sürecinden** (training pipeline) kaynaklanan **bilişsel etkiler** üzerinde duracağız. Ele alacağımız ilk başlık **halüsinasyonlar** olacak. Ardından **araç kullanımı** ve **bilgi/çalışma belleği** meselelerine geçeceğiz.

---

## Halüsinasyonlar

**Halüsinasyon** olarak adlandırdığımız durum, LLM'lerin **gerçek olmayan bilgiler** uydurması, yani tamamen kurgusal veriler üretmesidir. Bu, LLM asistanlarında büyük bir sorun olarak öne çıkar. Erken dönem modellerde de vardı ancak zaman içinde çeşitli iyileştirmeler yapıldı. Yine de bütünüyle ortadan kalkmış değil.

### Halüsinasyonların Kökeni

Bu halüsinasyonların neden ortaya çıktığını anlamak için şu örneğe bakalım:

- **Kimdir Tom Cruise?** → İnsanlar genelde “Tom Cruise ünlü bir Amerikalı aktör ve yapımcıdır.” şeklinde yanıt yazar.  
- **Kimdir John Barasso?** → Örneğin “ABD’li bir senatördür.” denebilir.  
- **Kimdir Cengiz Han?** → “Tarihi bir hükümdardır...” gibi doğru ve net bilgiler verilir.

Eğitim verilerinde bu soru-cevap türü diyaloglar yer aldığında, **insanlar cevapları genelde doğru bir biçimde** (ya bilgiyi önceden biliyorlar ya da internetten araştırıyorlar) ve **özgüvenli bir tonla** yazarlar. Model de **istatistiksel olarak** bu örüntüyü taklit eder. Sonuçta model, test zamanında hiç var olmayan birine dair, örneğin *“Orson Kovats kimdir?”* sorusu geldiğinde, **“Bilmiyorum.”** demek yerine, eğitildiği istatistiksel kalıbı izleyerek **bir şeyler uydurur**.

Model, parametrelerinin içinde ‘aslında bu ismi tanımadığını’ temsil edebilecek bir bellek/aktivasyon olsa bile, çoğu zaman verisetindeki **“Kimdir X?” sorusuna hep özgüvenli cevaplar verilir** biçimindeki örüntüyü taklit etmeye çalışır. Dolayısıyla, “Orson Kovats kimdir?” sorusuna da istatistiksel olarak **“Amerikalı yazar ve bilim kurgu yazarıdır”**, **“1950’lerdeki bir TV programının kurgusal karakteridir”** veya **“Eski bir beyzbol oyuncusudur”** gibi rastgele ama format olarak doğru gözüken yanıtlar verebilir.

Aşağıdaki gibi bir **Falcon 7B** (Hugging Face’teki eski bir model) örneği üzerinden gidildiğinde, aynı soruya farklı denemelerde farklı ‘uydurma’ cevaplar aldığımızı görürüz. Çünkü model **aslında bilmiyor** ve sadece **olası en muhtemel dizilimi** üretiyor.

---

## Halüsinasyonları Azaltma Yöntemi 1: “Bilmiyorum” Diyebilmek

Halüsinasyonları azaltmanın ilk adımlarından biri, modele **“Bilmiyorum” demeyi öğretmektir**. Ama bu sadece, model gerçekten bir bilgiyi “bilmiyorsa” geçerli olmalıdır. Burada zorluk, modelin neyi bilip neyi bilmediğini nasıl anlayacağımızdır.

Meta’nın **Llama 3** ailesi modelinde bu yaklaşımın bir örneğini görüyoruz. Meta, bu modele “hangi konularda bilgisi var, hangi konularda yok?” sorusunu **ampirik olarak** test edip, modelin cevap veremediği durumlar için eğitime yeni örnekler ekliyor. Kısaca:

1. Modeli bir dizi soru ile sorguluyorlar.  
2. Her soru için modelin cevabı, gerçekte **doğru mu değil mi** diye kontrol ediliyor.  
3. Eğer model yanıtlayamaz veya yanlış cevaplarsa, o soruya **“Üzgünüm, bunu bilmiyorum.”** benzeri bir cevap verilmesi gerektiği şeklinde bir etiket ekleniyor.  
4. Böylece eğitim verilerinde, **modelin gerçekten bilmediği durumlarda “bilmiyorum”** cevabı vermeyi öğreten yeni örnekler oluyor.

Bu sayede, modelin içinde “emin olmama” durumunu temsil eden nöron aktivasyonu (diyelim ki bir belirsizlik nöronu) ile **dilsel olarak** “Bilmiyorum” deme çıktısı ilişkilendirilmiş oluyor. Sonuçta, modelin parametreleri, o belirsizlik sinyalini **“Bilmiyorum”** ifadesine dönüştürmeyi öğreniyor. Bu yöntem, halüsinasyonları büyük oranda azaltabiliyor.

### Meta’nın Örneği

Diyelim ki rastgele bir paragraf aldık (örneğin Dominic Keke dair bir metin) ve bu paragraftan **üç soru** türettik. Bunun için **ChatGPT gibi** modellerden de yararlanabiliriz. Model paragrafı okur, “Bu paragraftan hangi özgül sorular sorulabilir?” ve “Bu soruların cevabı nedir?” gibi işlemler yapar. Çok bilinen konularda (metin açıkça eldeyse) yanıtlar oldukça tutarlı çıkar.

Ardından, örneğin Meta’nın Llama modelini alır, bu soruları ona yöneltiriz.  

- Eğer model üç denemede de doğru yanıt veriyorsa, modelin **bu bilgiyi bildiğini** kabul ederiz.  
- Eğer ısrarla yanlış cevap veriyorsa veya tutarsızsa, **modelin bilmediğini** saptarız.  

Böyle “bilmediğini” tespit ettiğimiz sorular için, eğitim setine “Bu sorunun cevabı: *Üzgünüm, bunu bilmiyorum*” şeklinde ek yaparız. Sonuçta, model eğitilirken “bilmediği” şeyler için **“yanlış cevap verme yerine, bilmiyorum demeyi”** öğrenir.

Örneğin Dominic Hasek’in **kaç tane Stanley Cup** kazandığı sorulduğunda, diyelim ki model önce **4** demiş, sonra **hiç kazanmamış** demiş… tutarsız olduğundan dolayı ***bilmiyor*** sonucuna varılır. Eğitime bununla ilgili bir örnek eklenir: “Stanley Cup sayısını bilmeyen modelin doğru cevabı: *Üzgünüm, bunu bilmiyorum*”. Böylece bu yaklaşım, halüsinasyonların birinci derecede azaltılmasına yardımcı olur.

---

## Halüsinasyonları Azaltma Yöntemi 2: Araç (Tool) Kullanımı

Sadece **“Bilmiyorum”** demek yerine, bazen modelin **gerçekten doğru cevaba ulaşması** gerekir. Biz insanlar da bir konu hakkında net bilgimiz yoksa **internetten araştırır**, sonra cevabı iletiriz. LLM’lere de benzer bir mekanizma ekleyerek **araç kullanabilmelerini** sağlayabiliriz. Buna kısaca “tool use” diyoruz.

### Örnek: Web Arama Aracı

Modelin içinde yerleşik bir **internet erişimi** yoktur. Belleğinde (parametrelerinde) bir şeyler tutar ama bazen buna güvenmek yanıltıcı olur. Oysa model, **“Web araması yapma”** gibi bir araca yönlenebilirse, **“çalışma belleğine”** güncel, doğru bilgiyi getirerek tutarlı cevaplar üretebilir.

Bunu yapmak için modele, özel **token**’lar ve bir **protokol** tanıtıyoruz. Örneğin:

**Ara: [search_start] kimdir Orson Kovats [search_end]**

Model, bu özel **[search_start]** ve **[search_end]** token’larını üreterek, “Bu sorguyu web’de aramak istiyorum.” demiş olur. Modelin çıkışını dinleyen uygulama (arka plandaki kod), bu token’ı gördüğünde **örneğin Bing veya Google API’sine** soruyu gönderir. Gelen yanıtlar ise **modelin tekrar girdi bağlamına** (context window) yerleştirilir. Model, bu taze bilgiyi okuduktan sonra ***sonraki*** token’ları üretir. Böylece:

1. **Parametreler** (modelin beyni) “uzun vadeli, muhtemelen eksik veya bulanık” bilgiyi temsil eder.  
2. **Bağlam (context) penceresi** ise, “çalışma belleği” işlevi görür. Oraya anlık olarak eklenen bilgiler (ör. web’den gelen sonuçlar) modelin doğrudan erişebildiği güncel veriyi oluşturur.

### Nasıl Öğretilir?

Modelin **[search_start]** gibi token’ları düzgün kullanabilmesi için, **onu bu konuda eğiten örnekler** gerekir. Örneğin:

- “Şu durumlarda web’de arama yap.”  
- “Aramayı böyle başlat, şöyle bitir.”  
- “Arama sonuçlarını nasıl filtrele, nasıl özetle.”  

Model, zaten eğitildiği devasa veri sayesinde, web aramasının ne olduğuna dair **genel bir kavrayışa** sahiptir. Birkaç bin örnek eklenince, **nerede arama yapması gerektiğini**, **hangi sorguyu kullanacağını** öğrenir ve doğru zamanda bu aracı çağırır.

Böylece, halüsinasyonların ikinci derecede azaltılması sağlanır. Model **“Bilmiyorum”** yerine, “Dur bir bakayım” diyerek web araması yapar, yanıtı tekrar bağlamına ekler ve **doğru cevabı** sunar.

Örneğin ChatGPT’de *“Orson Kovats kimdir?”* dediğimizde, bazen modelin **iki saniye durduğunu**, “Araç kullanılıyor” veya “Web’de arıyorum” tarzında bir ibare gösterdiğini fark edebiliriz. Bu esnada model, “search” fonksiyonunu kullanıp bulguları bağlamına alır ve sonra *“… Bu isimle ilgili net bilgi bulunamadı.”* gibi bir sonuca varabilir. 

Öte yandan, eğer model bellek parametrelerinde yeterince güvenilir bir bilgi varsa, ***web araması yapmadan*** direkt yanıt verebilir. Örneğin, “Dominik Hasek kaç tane Stanley Cup kazandı?” sorulduğunda, yeterince ünlü ve sık tekrarlanan bir bilgi olduğu için, model doğrudan **iki** demek isteyebilir. Ya da **kontrol etmek** için arama yapmayı seçebilir.

---

## Bilginin Parametrelerde Olması vs. Bağlam (Context) Penceresi

Burada vurgulanması gereken önemli bir “psikolojik” nokta şudur:

1. **Modelin parametrelerinde (ağırlıklarında) kodlanmış bilgi**, kabaca “aylar önce okuduğu” ama tamamen mükemmel olmayan bir hatıraya benzetilebilir.  
2. **Bağlam penceresinde (context window) bulunan bilgi** ise, modelin “anlık çalışma belleği” gibidir ve doğrudan erişebildiği, taze verilerdir.

Bir LLM’i kullanırken, modelin büyük ölçüde **ikincisini** tercih ettiğini (yani bağlam penceresinde sunulan metni) göz önünde bulundurmak önemli. **Kaynak metni** doğrudan bağlama eklemek, her zaman modelin uydurmaya çalışacağı eski/eksik belleğinden daha güvenilirdir.

Örneğin:

- “Jane Austen’ın *Pride and Prejudice* adlı romanının 1. bölümünü özetler misin?” diye sorabilirsiniz. Model popüler olduğu için kabaca hatırlayabilir.  
- Ama **daha iyi** sonuç almak için, 1. bölümü **kaynak metin olarak** (copy-paste yaparak) bağlama eklemek ve “Lütfen aşağıya eklediğim bölümü özetler misin?” demek çok daha tutarlı bir sonuç getirir.  
- Çünkü model, “belleğine bel bağlamak” yerine **doğrudan elindeki metinden** özetleyecektir.

---

## Sonuç ve Genel Bakış

Bu derste, **LLM’lerin halüsinasyon** sorununa ve bunu azaltmak için kullanılan yöntemlere baktık:

1. **“Bilmiyorum” Diyebilme**: Modelin gerçekten bilmediği sorularda, yanlış cevap yerine *“Bilmiyorum”* demesini sağlamak için ek eğitim örnekleri kullanılabilir.  
2. **Araç Kullanımı (Web Araması vb.)**: Modelin parametrelerindeki bilginin yetersiz kaldığı durumlarda, ek araçlar üzerinden güncel veya daha kesin bilgilere ulaşarak yanıt vermesi sağlanabilir.

**Parametrelerdeki bilgi** ile **bağlam penceresindeki bilgi** arasındaki fark, insan hafızası ile kısa süreli çalışma belleği arasındaki farka benzetilebilir. Model, ikincisini güncel tutarak **daha güvenilir** ve **daha az halüsinasyonlu** sonuçlar üretebilir.

Böylece, LLM psikolojisi diyebileceğimiz bu mekanizmaları anladığımızda, modellerin **neden bazı durumlarda tutarlı cevap verip diğerlerinde halüsinasyonlar ürettiğini** açıklayabilir ve bu davranışları **daha öngörülebilir** hale getirebiliriz.

# **Öz Farkındalık (Knowledge of Self)**

Aynı bir kitabın özetini çıkaracağınız zaman önce o bölümü baştan sona tekrar okumak gibi, büyük dil modellerinin (LLM) de *kendi içeriklerini* hatırlayıp anlamalarını sağlamak özetlemeyi her zaman daha etkili hale getirir. Aslında bu, modellerin “okuduklarını” yeniden gözden geçirme kapasitesi gibi düşünülebilir. Fakat buradaki bir diğer **psikolojik tuhaflık** (aslında modelin içsel yapısından kaynaklanan bir özellik) tam da “öz farkındalık” (*knowledge of self*) meselesidir.

İnternette sıkça gördüğüm örneklerden biri, insanların modele “Sen kimsin?”, “Hangi modelsin?”, “Kim tarafından inşa edildin?” gibi sorular sormasıdır. Bu sorular, insani bakış açısıyla normal gözükebilir ancak aslında LLM’ler için biraz **anlamsız** kalır. Çünkü bu modeller:

- Bir **insan** değillerdir.
- Sürekli ve kalıcı bir benlik algısına sahip değillerdir.
- Her oturumda *sıfırdan* başlar, gelen metni (tokenları) işler ve oturum sonunda kapanır. Bir sonraki oturumda ise model tekrar baştan yüklenir ve önceki bağlamı hatırlamaz.

Bu nedenle, “Kimsin?” gibi sorulara gelen yanıtlar tamamen *içsel* veya *istatistiksel* tahminlere dayanır ve tutarsız olabilir. Örneğin **Falcon** gibi eski bir modelden “Kim tarafından geliştirildin?” diye sorduğunuzda, “OpenAI tarafından GPT-3 tabanlı olarak geliştirildim.” şeklinde bir yanıt üretebilir. Bu tamamen **uydurma** olabilir; yani model, eğitim sürecinde sıkça karşılaştığı “OpenAI” ve “GPT-3” gibi terimleri, kendisine yöneltilen bu ‘kimlik’ sorusuna **istatistiksel olarak en yakın** yanıt olarak sunar.

Birçok kişi, “Model OpenAI’dan bahsettiğine göre mutlaka OpenAI verileriyle eğitilmiştir.” gibi bir çıkarım yapabilir. Fakat bu doğrudan doğruya doğru olmak zorunda değildir. Model, eğitimi sırasında elde ettiği devasa miktarda internet verisi içinde *OpenAI* ve *ChatGPT* ifadelerini o kadar çok görmüştür ki, “Ben kimim?” sorusuna **en çok rastlanan** cevabı vermeyi öğrenmiş olabilir.

> **Kısacası**: Modelin “öz benliği” yoktur. O sadece *yardımcı asistan* rolü üstlenmek üzere eğitilmiştir. Kendini OpenAI’ye veya GPT-3’e atfetmesi, gerçekte kim tarafından eğitildiğini ifade etmekten çok, dilsel istatistiklerin bir sonucudur.

---

## **Geliştiricinin Müdahaleleri: Kimlik Bilgisi Sağlama**

Bir LLM modelini geliştirirken, modelin “Kimsin?” sorusuna cevap verme şeklini **açıkça** tanımlamak mümkündür. Bunun en yaygın iki yolu şunlardır:

1. **Eğitim Verisine Ekleme (Hardcoded Mesajlar)**
   
   - Modelin sonradan *ince ayar* (fine-tuning) aldığı konuşma verilerine (*conversations dataset*) “kimlik” bilgisi girilir.
   - Örneğin, Alen Enstitüsü (Allen Institute) tarafından geliştirilen *Alpaca benzeri* bir model (burada örnek olarak **AlMo** modeli geçiyor) incelersek, görürüz ki eğitim verisinin içine *240 adet* sabit soru-cevap diyaloğu eklenmiştir.
   - Bu diyaloglarda kullanıcı “Bana kendinden bahset.” diye sorunca, asistan şu şekilde yanıt vermesi için eğitilmiştir: “Ben, Allen Institute of Artificial Intelligence bünyesinde geliştirilen bir açık dil modeliyim. Görevim şudur…” gibi.
   - Bu 240 soru-cevap seti, modele kimliğini *ezberleterek* cevap vermesini sağlar. Eğer bu şekilde verilmezse model kendi varsayımsal kimliğini “ChatGPT/OpenAI” şeklinde **istatistiksel olarak** üretmeye yönelebilir.

2. **Sistem Mesajları (System Prompt)**
   
   - Kullanıcı ve asistan diyaloğunun *başlangıcına* genellikle gizli bir **sistem mesajı** eklenir.
   - Bu mesajda modele: “*Sen şusun, şöyle geliştirilmiş bir modelsin, bilgi kesim tarihin budur ve şu şekilde yanıt vereceksin*” gibi talimatlar verilir.
   - Siz ChatGPT’de boş bir sayfa görüyor olsanız da arka planda bu sistem mesajı diyaloğun bir parçası olarak modele aktarılır.
   - **Sonuç**: Model, kendisine “Kimsin?” diye sorulduğunda bu sistem mesajına dayanarak “Ben ChatGPT’yim, OpenAI tarafından geliştirildim...” gibi yanıtlar verir.

Özetle bu “kimlik” duygusu, insanlardaki gibi **derin** veya **kalıcı** bir benlikten ziyade, modelin dışarıdan *yapay* olarak verilen bilgileri veya istatistiksel olasılıkları **tekrarlamasından** ibarettir.

---

# **Modellerin Hesaplama Yetenekleri: “Düşünmek” için Token’a İhtiyaç Duymak**

Şimdi konuyu modellerin **doğal hesaplama kapasiteleri** ve problem çözme becerileri üzerine genişletelim. Bu noktada, bir LLM’den doğru sonuç alabilmek için kullanıcının **yazdığı yönlendirmenin** (promptun) nasıl kurgulandığı çok kritik hale geliyor.

- Bir modelin **matematiksel** veya **mantıksal** bir sorunu çözerken gerçekte ne yaptığını anlamak, doğru yönlendirme yazabilmek için çok önemli.
- Model, *sadece* elindeki **token** dizilimi ile işlem yapar. Yani “düşünme” süreci, modelin eğitildiği parametreler + o anki girdi cümleleri (tokenlar) üzerinden gerçekleşir.

Bu durum, *kusurları* ve *keskin köşeleri* de beraberinde getirir. Örneğin, modelden basit bir matematik işlemi yapmasını istediğimizde, biz doğru şekilde yönlendirmediğimiz sürece, model yanılma payı olan tahminler yapabilir. Eğitim setine dahil ettiğimiz konuşma örneklerinde ise modele adım adım doğru yaklaşımı göstermek, onun da benzer durumlarda aynı adımları tekrarlamasına imkân tanır.

---

Sonuç olarak, büyük dil modellerinin **“öz farkındalık”** (knowledge of self) konusundaki yanıtları, aslında eğitim süreçlerinde gördükleri veri yığınlarının istatistiksel tekrarından ibarettir. Bir modelin gerçekte **kimin tarafından** geliştirildiğini veya **gerçek kimliğini** öğrenmek istiyorsak, bu veriyi *dışarıdan* net şekilde tanımlayarak vermemiz gerekir. Aksi takdirde model, **insan benliğine benzer** bir varoluşu olmadığı için, “kimsin” sorusunu cevaplamak adına zihninde sadece **eğitim sırasındaki metinlerden** gördüğü, en uygun gördüğü ifadeleri tekrar edecektir.

## **Modellerin Düşünmek İçin *Tokenlara* İhtiyacı Var**

Şimdi **modellerin hesaplama kapasiteleri** (ya da *“models need tokens to think”* ifadesiyle vurgulanan) konusuna geçmek istiyorum. Özellikle *problem çözme* senaryolarında bu modellerin *yerel (native) hesaplama* becerilerinden bahsedeceğim. Burada, modellerle oluşturduğumuz konuşma örneklerini tasarlarken çok dikkatli olmamız gerekiyor çünkü “keskin köşeler” diyebileceğimiz pek çok ilginç durumla karşılaşıyoruz. Bu keskin köşeler, modellerin *nasıl “düşündüğünü”* anlamamızı kolaylaştırdığı için önemli.

### **Bir Örnek: Basit Matematik Problemi**

Aşağıdaki komutu (prompt) ele alalım. Diyelim ki, eğitim setimize dahil etmek için bir konuşma hazırlıyoruz ve modelin basit matematik problemlerini nasıl çözeceğini öğretmek istiyoruz:

> *Emily üç elma ve iki portakal alıyor. Her portakal 2 dolar. Toplam tutar 13 dolar. Elmaların tanesi kaç dolardır?*

Bu çok basit bir matematik sorusu. Cevabı da “3 dolar” (ya da “3”) olarak buluyoruz. Fakat burada iki farklı örnek cevap sunalım:

- **Cevap A:**  
  *Cevap 3 dolardır. Dolayısıyla elmaların tanesi 3 dolardır.*

- **Cevap B (Daha Detaylı):**
  
  1. *İlk olarak, 2 portakalın toplam maliyeti 2x2 = 4 dolardır.*
  2. *Toplam 13 dolardan portakalların 4 dolarını çıkarırsak geriye 9 dolar kalır.*
  3. *Bu 9 dolar, 3 elmanın toplam maliyetidir. Dolayısıyla her bir elma 3 dolara gelmektedir.*

Her iki cevap da sayısal olarak doğru, ama birini **veri etiketleyicisi (data labeler)** olarak tercih edecek olsam, detaylı cevabı (yani *Cevap B*’yi) modelin eğitim verisine koymayı çok daha uygun bulurum. Çünkü *Cevap A* gibi “tek atışta” sonuca giden bir ifade, modelin ileride benzer problemleri çözerken zorlanmasına neden olabilir.

#### **Neden Ayrıntılı Cevap Daha İyi?**

Modelin öğrenme ve tahmin aşamalarında, metin sol baştan sağa doğru *token* olarak işlenir. Bu işlem, her token için sınırlı sayıda katmanda (layer) ve sınırlı bir hesaplama miktarıyla (forward pass) yapılır. Yani:

- Model, “önceki token”ları okur,
- İçindeki nöronlar belirli bir hesaplama yapar,
- Ve “bir sonraki token” çıkma olasılıklarını üretir.

Modern modellerde katman sayısı (örneğin 100 civarı) epey büyük olsa da, **her token için** gerçekleşen hesaplama süresi yine de *sabit* veya hemen hemen sabit bir büyüklüktedir. Model, **tek bir token** üretebilmek için çok kapsamlı bir hesaplama yapamaz. Bu nedenle:

- Modelin karmaşık bir mantık yürütme veya aritmetik işlemi yapması gerekiyorsa, **hesaplamayı birden çok token’a yayması** şarttır.
- *“Hepsini tek token’da hallet”* derseniz, modelin o token sırasında baştan sona tüm işlemi yapması gerekir ve bu genellikle hatalara yol açar.

Yukarıdaki örneğe dönersek, *Cevap A* (hemen “$3” diyerek sonuca gitme) modelin tek seferlik bir token üretimiyle tüm matematiği *arka planda* halletmesini ister. Oysa *Cevap B* gibi ara adımları gösteren bir cevap, modeli adım adım hesaplama yapmaya teşvik eder. Böylece her token’da ufak ufak ilerleyip en sonunda doğru cevaba ulaşır. Bu yaklaşım, modelin **doğru öğrenebilmesi** ve **tahmin yaparken hata payını azaltabilmesi** için çok daha iyidir.

---

### **Örnek: Tek Tokenda Cevap Zorlukları**

Aynı mantığı bir adım ileri götürelim. Şöyle bir talimat verelim:

> *“Answer the question in a single token. Just immediately give me the answer and nothing else.”*

Basit sayılar kullandığımızda (örneğin “3 elma”, “2 portakal” gibi), model yine de bazen **tek token** (ya da tek seferlik yanıt) vererek doğru cevabı tutturabiliyor. Çünkü işlem çok küçük ve **az katman** da yetebiliyor.

Ancak sayıları büyüttüğümüzde, örneğin *“Emily buys 23 apples and 177 oranges…”* şeklinde, aynı “tek token” sorusuna modelin cevap vermesi çok daha zor hale geliyor. Tek bir seferlik tahminde çok büyük bir aritmetik işlem yapmaya çalışırken yanılma ihtimali artıyor. Birkaç katmanda bu kadar hesaplamayı *tek token* içinde çözmek zorlaşıyor ve model yanlış cevap verebiliyor.

Buna karşılık, modelden **adım adım** (örneğin “*Önce portakalların maliyetini hesapla, sonra geriye kalanı elmalara böl…*” gibi) bir açıklama istemek, her ara adıma ayrı token’lar ayırmak demek. Her aşamada görece basit bir işlem yapıldığı için toplamda doğru cevaba ulaşmak çok daha kolay ve güvenilir hale geliyor.

---

### **Kod Kullanmaya Yönlendirmek**

Gerçek hayatta bu tür hesaplamalara *daha* fazla güvenmek istediğimizde, “zihinsel aritmetik” yerine modele **kod yazdırmak** daha güvenilir olabilir:

- *“Use code.”* gibi bir komut verdiğimizde, model bir Python programı üreterek hesaplamayı yapabilir.
- Python gibi dillerde basit bir `count` veya toplama işlemi, dil modelinin kendi *nöral tahmin* mekanizmasından daha güvenilir sonuçlar verir.
- Siz de çıkan kodu gözden geçirir, gerçekten ne yaptığını anlarsınız. Bu sayede modele “kafadan” hesaplatmak yerine **aracı** (tool) kullanmış olursunuz.

Örneğin, büyük sayılarla toplama-çıkarma yapmak istediğimizde:

1. Model, *“İçinden şu sayıları alıp topla.”* şeklinde basit bir Python kodu yazar.
2. Python kodu gerçek bir yorumlayıcıda (interpreter) çalışır ve sonucu döndürür.
3. Model, geri dönen bu sonucu bize söyler.

Bu süreçte, model “neredeyse hiç” hata yapmaz çünkü asıl hesaplamayı *Python* yapar. Model sadece “ara yüz” gibi davranır.

---

### **Başka Bir Örnek: Nokta Sayma (Counting)**

Sayı saymak da aynı mantıkla, **tek seferde** (tek token’da) modelin yapabileceği bir şey değildir. Örneğin:

> **Soru:**  
> *“Aşağıdaki satırda kaç tane nokta var?”*  
> Ve peşine 100’den fazla noktadan oluşan bir dizi eklediğimizi düşünelim.

Model, sorunun yanıtını *tek token* içinde vermeye çalışıyorsa, bu **bir ileri-geri geçiş** (forward pass) süresince yapabileceğinden fazla bir işlemdir. Tokenizer (metni tokenlara ayıran sistem) bazen nokta gruplarını tek bir token olarak kabul edebilir, bazen farklı şekillerde bölebilir. Sonuçta modelin:

- Tokenları **görmesi**,
- Her token için sınırlı bir hesaplama yapması,
- Ve tek hamlede doğru sayıyı çıkarması

genellikle mümkün olmaz. Modele *“Tek seferde yanıtla”* dediğinizde, muhtemelen yanlış bir rakamla karşılaşırsınız.

Bunun yerine “Use code” dediğimizde, model bir Python kodu yazar; örneğin:

```python
`dots = ".......... (burada gerçek noktalar) .........." 
count = len(dots) 
print(count)`
```

Bu sayede sayma işlemini *python* üstlenir, model sadece **copy-paste** tarzı bir ara işlem yapar. Böylece güvenilir ve doğru bir sonuca ulaşılır.

---

## **Sonuç: Hesaplamayı Tokenlara Yaymak**

Bu nedenle diyoruz ki: **“Modellerin düşünmek için *tokenlara* ihtiyacı var.”** Birçok token’a yayılan, adım adım ilerleyen bir çözüm, modelin hesaplama kısıtlarını aşmasına yardımcı olur. Eğer modelin hesaplamasını *tek token*’a sıkıştırmaya çalışırsanız modelin katmanları sınırlı kaldığından büyük olasılıkla yanlış sonuçlar alırsınız.

Bu durumu **matematikte**, **mantık problemlerinde**, **uzun liste sayımlarında** ve daha pek çok senaryoda göz önünde bulundurmak gerekir. **Ara sonuçları** üretmesi için modele fırsat vermek veya **harici araçlar** (kod, Python vb.) kullanmasına izin vermek, **hata payını önemli ölçüde düşürür**.

> Özetle:
> 
> - **Adım adım çözüm** isteyin.
> - **Ara hesaplamalar** görmek, hem modelin hem sizin için güvenilirliği artırır.
> - **Kod veya benzeri araçlar** kullanarak, modelin nöral “zihinsel aritmetiğine” kalmadan doğru sonuçlar elde edebilirsiniz.

## Tokenization Revisited: Models Struggle with Spelling (Tokenization Tekrarı: Modeller Yazımda Zorluk Yaşıyor)

Az önce sayma işlemini *python* üstlenir dedik. Yan bir **Python kodu** çağrılır, sayma işlemi gerçekleştirilir ve doğru cevaba ulaşılır. Yani, sayma işlemini yapan modelin **mental arithmetik**'i (zihinsel aritmetiği) değil, **Python interpreter**'ı (Python yorumlayıcısı)dır. Bu, yeniden; modellerin düşünmek için **tokens**'a (tokenlara) ihtiyaç duyduğuna ve onların zihinsel aritmetiklerine güvenmememiz gerektiğine dair basit bir örnektir.  

*Eğer onlardan sayma görevlerini yapmalarını isterseniz, her zaman araca (tool) bel bağlamalarını talep edin.*

Ayrıca, modellerin burada ve orada pek çok küçük **cognitive deficits** (bilişsel eksiklik) bulunmaktadır. Bunlar, teknolojinin zamanla farkında olunması gereken adeta keskin kenarları (sharp edges) gibidir. 
Örneğin, modeller her türlü **spelling** (yazım) ile ilgili görevlerde pek iyi değildirler; bu konuda başarısızlıkları mevcuttur. Daha önce de belirttiğim gibi, tokenizasyon (tokenization) konusuna tekrar değineceğiz. Bunun temel nedeni; modellerin bireysel **characters** (karakterleri) görmemeleri, sadece **tokens** (tokenları) görmeleridir. Onların tüm dünyası, küçük metin parçacıkları olan tokenlardan ibarettir. Bu yüzden, bizim gözlerimiz gibi karakterleri ayırt edemezler ve bu basit karakter düzeyindeki (character level) görevler sıklıkla başarısız olur.

Örneğin, bana verilen bir dize **"ubiquitous"** (ubiquitous) üzerinden, ilk karakterden başlayarak yalnızca her üçüncü karakteri yazdırmasını istiyorum. Yani şöyle:

- İlk harf: **U**
- Sonrasında, her üçüncü karakter… 
  *Örneğin; 1, 2, 3, sonra **Q*** gibi devam etmesi beklenirken, elde edilen sonuç doğru değildir.

Hipotezim şu ki:

1. Bu durumda, modelin zihinsel aritmetiği (mental arithmetic) biraz başarısız oluyor.
2. Ancak asıl önemli mesele şudur: Bir **tokenizer**'a (tokenizer) "ubiquitous" kelimesine baktığınızda bunun üç token’dan oluştuğunu görürsünüz. Siz ve ben "ubiquitous" kelimesini okuduğumuzda bireysel harflere kolayca erişebiliriz; çünkü onları görür, görsel çalışma belleğimizde (working memory) tutabiliriz. Fakat modeller, bu kelimeyi üç token olarak algılar ve bireysel harflerine ayrı ayrı erişemezler.

*Unutmayın:* Bu modeller, **from scratch** (sıfırdan) internet üzerinde eğitilmiştir. Dolayısıyla, modelin keşfetmesi gereken şey, bu farklı harflerin (letters) tümünün, her bir token'ın (tokens) içine nasıl paketlendiğidir. 
Token'ları kullanmamızın başlıca nedeni **efficiency** (verimlilik) sağlamaktır. Ancak pek çok kişi, tamamen token kullanımını ortadan kaldırıp karakter (character level) ya da bayt (byte level) seviyesinde modellere sahip olunması gerektiğini öne sürse de; bu durum çok uzun **sequences** (diziler) oluşturur ve şu anda bununla nasıl başa çıkılacağı tam olarak bilinmemektedir.

Dolayısıyla, token dünyasında (token World) herhangi bir yazım (spelling) görevinin süper iyi çalışması beklenmez. 
Yazımın (spelling) tokenizasyon (tokenization) nedeniyle güçlü bir yan olmadığı bilindiğinden, yine araca (tools) bel bağlamasını isteyebilirim. Mesela, **use code** (kodu kullan) diyerek; "ubiquitous" kelimesini **copy-paste** yöntemiyle Python yorumlayıcısına (Python interpreter) aktarmak çok daha kolaydır. Böylece, Python yorumlayıcısı dizedeki karakterleri manipüle eder. 
*Komutu verdiğimde ("use code ubiquitous"), evet, model her üçüncü karaktere indeksleme yapar ve elde edilen sonuç aslında **u2s uqs** gibi görünmektedir; bu da yazımla ilgili görevlerin ne kadar başarısız çalışabildiğine dair bir örnektir.*

Bunun çok ünlü bir örneği de, son zamanlarda **"strawberry"** (strawberry/çilek) kelimesinde kaç tane **R** harfi bulunduğudur. Bu sorgu defalarca viral olmuştu. Başlangıçta, modeller "Strawberry" kelimesinde yalnızca iki **R** harfi olduğunu iddia ediyordu; oysa artık doğru olarak üç **R** harfi olduğunu söylüyorlar. Bu durum büyük bir tartışmaya (ruckus) yol açtı. 
*İlginçtir ki:* Modeller, karmaşık matematik olimpiyatı sorularını çözmede son derece başarılıyken, basit bir şekilde "strawberry" kelimesindeki **R** harflerini sayamıyorlar. Bunun nedeni ise;

- **Birincisi:** Modeller, karakterleri görmez, sadece tokenları görür.
- **İkincisi:** Sayma işlemlerinde pek başarılı değillerdir.

Kısacası, karakterleri görme zorluğu ile sayma zorluğu birleşince, modeller bu konuda zorlanmaktadır. (Not: Açıkçası, sanırım OpenAI bu özel sorgu için cevabı sabitlemiş olabilir ya da ne yaptıklarından emin değilim; ancak bu sorgu artık doğru çalışıyor.)  
Sonuç olarak, modeller yazım (spelling) konusunda pek iyi değiller. Bunun yanı sıra, başka birçok küçük keskin nokta (sharp edges) de bulunmaktadır. Tüm eksiklikleri kapsamlı biçimde ele almak yerine, yalnızca farkında olunması gereken birkaç örneği paylaşıyorum. Pratikte bu modelleri kullanırken, eksiklikleri hakkında kapsamlı bir analiz yapmak yerine, arada bazı pürüzlü noktaların (jagged edges) mevcut olduğunu bilmek önemlidir.

**Jagged Intelligence (Pürüzlü Zeka)**

Bazı eksiklikler mantıklı bir açıklamaya sahipken, bazılarının ise pek mantıklı gelmediğini görüyorsunuz; öyle ki, bu durum modellerin çalışma mantığını derinlemesine kavramış olsanız bile kafanızı karıştırabilir.  
Buna iyi bir örnek, son zamanlarda karşılaşılan şu durumdur:  
Modeller, çok basit sorularda pek iyi performans göstermiyor. Bu, birçok kişiyi şaşırtıyor çünkü modeller karmaşık matematik problemlerini, doktora düzeyinde fizik, kimya, biyoloji sorularını benden çok daha iyi çözebiliyor; ancak bazen aşırı basit sorunlarda yetersiz kalıyorlar.

Örneğin, model "9.11'in 9.9'dan daha büyük olduğunu" iddia edip bunu bir şekilde gerekçelendiriyor; fakat sonrasında kararını değiştiriyor. Sanırım bu durum tutarlı (reproducible) değil; bazen cevabı değiştiriyor, bazen doğru, bazen yanlış sonuç veriyor. Tekrar denediğinizde, hatta bazı durumlarda kendini düzeltmese de, bazen doğru cevabı verebiliyor.  
*Nasıl oluyor da model, olimpiyat düzeyinde problemleri çözerken, bu kadar basit bir sorunda başarısız oluyor?*  
Bence bu durum biraz kafa karıştırıcı. Birçok araştırmacı bu konuyu derinlemesine incelemiş; ben makaleyi tam olarak okumamış olsam da, ekipten bana anlatılan şudur:  
Sinir ağı (neural network) içindeki aktivasyonları (activations) ve özellikleri (features) incelediğinizde, genellikle İncil ayetleriyle (Bible verses) ilişkilendirilebilecek bir dizi nöronun (neurons) etkinleştiğini görüyorsunuz. Model, bu durumdan dolayı neredeyse İncil ayeti işaretçileri (Bible verse markers) gibi bir etki altında kalıyor. Örneğin, İncil ayetlerinde, "9.11" ifadesi "99.9" ifadesinden sonra gelirdi. Bu nedenle, model için, İncil ayetleri bağlamında "9.11" in daha büyük olması bilişsel olarak (cognitively) rahatsız edici bir durum oluşturuyor. Oysa model, matematiksel gerekçeyle sonuca ulaşmaya çalışsa da yanlış cevaba varıyor.  
Özetle, bu sistem inanılmaz derecede büyüleyici (magical) olsa da, tamamen güvenilemeyecek **stochastic system** (rastlantısal sistem) niteliğindedir. Onu, bir problemi parça parça işleyip sonuçları **copy-paste** yöntemiyle alabileceğiniz bir şey olarak görmek yerine, bir araç (tool) olarak kullanmalısınız.

---

Şimdi, **büyük dil modellerinin (Large Language Models)** eğitim sürecinin iki ana aşamasını ele aldık. İlk aşamada, **pre-training** (ön eğitim) aşaması denilen süreçte, temelde internet belgeleri üzerinde eğitim yapıyoruz. İnternet belgeleri üzerinde eğitilmiş bir dil modeli, aslında bir **base model** (temel model) haline gelir ve bu model, temelde bir internet belge simülatörüdür.

---

## Supervised Finetuning to Reinforcement Learning (Gözetimli İnce Ayar'dan Takviyeli Öğrenmeye)

Şu anda, ilginç bir çıktı(artifact) olarak gördüğümüz bu aşamanın, binlerce bilgisayarda aylarca süren eğitim gerektirdiğini, internetin kayıplı (lossy) bir sıkıştırması (compression) gibiydiğini belirtmiştik. Son derece ilginçtir; ancak doğrudan kullanışlı değildir. Çünkü internet belgelerini örneklemek istemiyoruz. Bir yapay zekaya (AI) soru sorup onun yanıt vermesini istiyoruz. Bunun için de bir asistan (assistant) gerekmektedir. Post-training süreci kapsamında, özellikle de **supervised fine-tuning** (gözetimli ince ayar) sürecinde, bir asistan inşa edebileceğimizi gördük.

Bu aşamada, algoritmik olarak **pre-training** (ön eğitim) ile aynı yöntem kullanılmaktadır; değişen tek unsur, kullanılan veri setidir. İnternet belgeleri yerine artık, insan ile asistan arasında, çeşitli konularda milyonlarca konuşmayı içeren çok kaliteli bir konuşma veri seti oluşturmak ve düzenlemek istiyoruz. Temelde bu konuşmalar insanlar tarafından oluşturulur; insanlar komutları (prompts) yazar, ideal yanıtları (ideal responses) üretir ve bunu etiketleme dokümantasyonuna (labeling documentations) dayandırırlar.  
*Günümüz teknolojik yığınında (modern stack), bu süreç tamamen elle yapılmamakta; birçok araç (tools) sayesinde dil modellerinden yardım alınmaktadır. Ancak sonuçta, her şeyin kaynağı insan kürasyonu (human curation)'dur.*

Oluşturduğumuz bu konuşma veri seti üzerinde **fine-tuning** (ince ayar) yapar veya eğitimimize devam ederiz; böylece bir asistan elde etmiş oluruz. Sonrasında, bu asistanın bilişsel etkileri (cognitive implications) üzerine konuşmaya başladık. Örneğin, asistan üzerinde bazı önlemler (mitigations) alınmadığında, **hallucinations** (hayal ürünü yanıtlar) vermesi yaygın bir durum olarak karşımıza çıkmaktadır. Ardından, bu hayal ürünlerine yönelik bazı çözüm yollarını inceledik.

Ayrıca, modellerin zihinlerinde (in their head) pek çok işlemi yapabildiklerini gördük; fakat daha iyi sonuçlar elde edebilmek için araçlara (tools) bel bağlayabildiklerini de gözlemledik. 
Örneğin:

- **Web search** (web araması) kullanarak daha az hayal ürünü yanıt üretmek ve daha güncel bilgileri getirmek;
- **Code interpreter** (kod yorumlayıcısı) gibi araçlara bel bağlayarak, dil modelinin (LLM) kod yazıp çalıştırmasını ve sonuçları görmesini sağlamak.

Şimdiye kadar ele aldığımız konular bunlar.  
*Sıra, bu iş akışının (pipeline) son ve ana aşaması olan **reinforcement learning**’e (takviyeli öğrenme) gelmektedir.*

Takviyeli öğrenme, hâlâ post-training (son eğitim) kapsamına dahil olarak düşünülse de, aslında üçüncü ve son ana aşamadır. Bu, dil modellerini eğitmenin farklı bir yöntemidir ve genellikle üçüncü adım olarak uygulanır. Örneğin, OpenAI gibi şirketlerde;

- Bir ekip **pre-training** (ön eğitim) için veri toplar ve başka bir ekip bu verilerle eğitimi gerçekleştirerek Base Model'i çıkarır,
- Ardından, ayrı bir ekip **supervised fine-tuning** (gözetimli ince ayar) kapsamında konuşma üretimi yapar,
- Ve son olarak, **reinforcement learning** (takviyeli öğrenme) için ayrı bir ekip çalışır.

Her aşama, şirket içinde ayrı ekipler tarafından yürütülür ve model adım adım el değiştirerek (handoff) bu süreçleri tamamlar : Temel model elde edilir, asistan haline getirilmesi gerektiği fark edilir ve ardından takviyeli öğrenmeye geçilir.

### Neden Reinforcement Learning? (Motivasyon)

Şimdi, eğitimin son ana aşaması olan **reinforcement learning**'e (takviyeli öğrenmeye) odaklanalım. Öncelikle, neden takviyeli öğrenme yapmak istediğimizi ve bunun genel hatlarıyla nasıl göründüğünü açıklamak istiyorum.

Takviyeli öğrenme aşamasını, muhtemelen aşina olduğunuz bir şeye – okula gitmeye – benzeterek açıklayalım. Tıpkı bir konuda gerçekten iyi olmak için okula gittiğiniz gibi, büyük dil modellerini de “okula” götürmek istiyoruz. Burada, onlara bilgi verme veya becerileri aktarma yöntemleri için birkaç paradigma (paradigm) mevcuttur. Özellikle okulda kullanılan ders kitaplarında üç ana bilgi türü (three major classes of information) olduğunu göreceksiniz:

1. **Exposition (Açıklama):**  
   Ders kitaplarının büyük bir kısmı, konunun özü olan açıklamalardan oluşur. *(Bu, arka plan bilgisi [background knowledge] gibidir.)* İnternetten rastgele seçtiğim, örneğin organik kimya kitabı gibi bir kitapta bile, metnin çoğu açıklamadan ibarettir. Bu açıklamaları okurken, aslında o veriler üzerinde eğitim (training) yapmış oluyorsunuz. Bu süreç, ön eğitim (pre-training) ile eşdeğer sayılabilir; çünkü bu aşamada, veriler üzerine bir bilgi tabanı (knowledge base) oluşturuyor ve konuyu kavramsallaştırıyoruz.

2. **Problems and Worked Solutions (Problemler ve Çözülmüş Çözümler):**  
   Bir insan uzmanı (human expert) – örneğin kitabın yazarı – size sadece bir problem sunmakla kalmaz, aynı zamanda çözümünü de detaylı şekilde gösterir. Bu çözüm, asistan için ideal yanıtı (ideal response) elde etme sürecine eşdeğerdir. Uzman, problemi nasıl çözeceğini tam haliyle gösterir. Böylece, çözümü okurken uzman verileri (expert data) üzerinde eğitim yapar, sonrasında bu bilgileri taklit etmeye (imitation) çalışabilirsiniz. Bu süreç, kısaca **supervised fine-tuning** (gözetimli ince ayar) modelinin yaptığı işe denk gelir.

3. **Practice Problems (Pratik Problemler):**  
   Ders kitaplarının her bölümünün sonunda genellikle pek çok pratik problem bulunur. Pratik problemler öğrenme süreci için kritik öneme sahiptir; çünkü bunlar, kendi başınıza pratik yapmanızı ve problemleri çözmenin farklı yollarını keşfetmenizi sağlar. Bir pratik problemde, problem tanımı (problem description) verilir, ancak çözüm adım adım sunulmaz; yalnızca cevap anahtarında (answer key) yer alan nihai sonuç (final answer) bilinir. Böylece, siz hem problemi görür hem de nihai cevabı bilir, fakat çözümü kendiniz üretmeye çalışırsınız. Bu süreçte;
   
   - Ön eğitimden (background information from pre-training) aldığınız bilgi,
   - Ve insan uzmanları taklit etme (imitation of human experts) deneyiminiz devreye girer. 

Böylece, benzer çözümler denersiniz ve hangi yöntemin nihai sonuca en iyi ulaştırdığını keşfedersiniz.

Özetle, ön eğitim (pre-training) ve uzmanları taklit etme sürecini (imitation of experts) zaten gerçekleştirdik. Artık takviyeli öğrenmenin (reinforcement learning) üçüncü aşaması olan pratik problemler üzerine odaklanıyoruz. Bu aşamada bize komutlar (prompts) verilecek, nihai cevaplar (final answers) sunulacak, ancak uzman çözümleri (expert solutions) verilmeden; biz pratik yapıp denemeler gerçekleştireceğiz. İşte takviyeli öğrenmenin (reinforcement learning) özü budur.

---

## **Reinforcement Learning (Pekiştirmeli Öğrenme)**

Bu bölümde, *reinforcement learning (pekiştirmeli öğrenme)* kavramını büyük dil modelleri (*large language models - LLMs*) bağlamında nasıl kullandığımızı anlatacağız. Buradaki amaç, modelin kendi çözümlerini deneyerek doğru sonuçlara nasıl ulaşabileceğini ve bu sonuçları kalıcı olarak nasıl öğrenebileceğini göstermektir.

---

### **Örnek Senaryo ve Token (Belirteç) Görselleştirme**

Videodaki örnekte, “**Emily buys three apples and two oranges each orange is $2 the total cost of all the fruit is $13 what is the cost of each apple?**” şeklinde bir problem ele alınıyor. Problem **$3** cevabına ulaşıyor. Burada dikkat etmemiz gereken:

- LLM’lerin içsel olarak **tek boyutlu belirteç dizileri (token sequences)** ile çalıştığı.
- Modelin gözünde aslında yalnızca **token ID’leri** olduğu.
- Çözüm sürecinde bazen denklemler kurulduğu, bazen de düz İngilizce (ya da herhangi bir dil) açıklamayla sonuca varılabildiği.

Örneğin elimizde cevaba (3 dolar) ulaşan dört farklı metin tabanlı çözüm olduğunu düşünelim. Hepsi doğru cevaba ulaşsa da, sunum ya da çözüm yöntemi (denklem kurma, doğrudan hesaplama, adım adım izah vb.) birbirinden farklı olabilir.

**Buradaki önemli nokta**: İnsan etiketleyici (human data labeler) olarak bu çözümlerden hangisinin *model için* en iyisi olacağını bilemeyiz. Çünkü bize kolay gelen bir ifade modeli gereğinden fazla zorluyor olabilir; modelin “düşünce” mekanizması ile bizimki birebir aynı değildir. Aynı şekilde, bizim uzun uzun anlattığımız bir yol ona gereksiz gelebilir. Dolayısıyla *yalnızca doğru cevabı* elde etmek ise birinci amaçtır, ama çözümün *insana anlaşılır* veya *model için kolay* olması gibi farklı boyutlar da mevcuttur.

Eğer tek amacımız doğru cevabı (örnekte **3**) elde etmekse, bu dört farklı çözüm metninden hangisinin “en iyi” olduğu sorusu ucu açık kalır. Çünkü *biz*, modelin hangi token (belirteç) dizilerini daha kolay veya daha zor işlediğini tam olarak bilemeyiz.

---

### **Modelin Bilişsel Sınırlamaları ve Token Düzeyinde Zorluk**

- LLM’ler her **token** için sınırlı miktarda hesaplama yapar.
- Her token’da büyük sıçramalar (karmaşık hesaplar) yapmaya çalışmak hata riskini artırabilir.
- Kimi zaman problemi küçük adımlara bölmek ya da belirteçleri dikkatli şekilde yaymak modelin işini kolaylaştırır.
- Bazı adımlar bize çok basit görünebilir ama model için karmaşık olabilir; veya tam tersi, bize uzun gelen açıklamalar modelin aslında çok hızlı çözebileceği kısımlar olabilir.

Dolayısıyla, *doğru cevabı* alırken **nasıl** bir diziye (belirteç dizisi) ihtiyaç duyulduğunu, insan olarak tam kestiremiyoruz. Bizimle modelin bilişsel süreçleri bir değildir; model büyük olasılıkla matematik ve başka alanlarda çok geniş bir bilgiye (*PhD in math, physics, chemistry*) sahiptir ama yine de belirli noktalarda “ani sıçramalar” (sudden leaps) yapmak zorlanmasına neden olabilir.

İşte bu nedenle, **yalnızca taklit (imitation) yöntemiyle** insan tarafından etiketlenmiş çözümlerle eğitmek yetmez. Modelin, kendi bilişsel mekanizmasıyla **en uygun** çözüm dizilerini keşfetmesi gerekir. İşte *reinforcement learning (pekiştirmeli öğrenme)* burada devreye giriyor.

---

### **Reinforcement Learning (Pekiştirmeli Öğrenme) Süreci**

Bu süreci basitçe şöyle özetleyebiliriz:

1. **Farklı Çözüm Denemeleri**  
   Model aynı *prompt (istem)* için çok sayıda çözüm (çıktı) üretir. Bu çıktıların hepsi *stokastik (stochastic)* yapıda olduğu için, *token* düzeyinde her adımda bir **olasılık dağılımı (probability distribution)** üzerinden seçim yapar. Dolayısıyla her seferinde çözüm yolu değişebilir.

2. **Çözümlerin Değerlendirilmesi**
   
   - Doğru cevaba ulaşılan çözümler “başarılı” olarak işaretlenir.
   - Yanlış sonuca gidenler “başarısız” olarak işaretlenir.
   - Eğer problem “3 dolar” cevabını gerektiriyorsa, bu cevabı veren yollar yeşil (doğru), vermeyenler kırmızı (yanlış) olarak etiketlenir.

3. **Başarılı Çözüm Yollarını Teşvik Etme**
   
   - Model, kendi ürettiği doğru çözümleri (yani kendi “başarılı” yollarını) *örnek* olarak alır.
   - Parametrelerini güncelleyerek gelecekte benzer sorunlara benzer yöntemlerle yaklaşma eğilimi kazanır.

4. **Modelin Kendi Kendine Öğrenmesi**
   
   - Bu noktada artık insanın “Şu adımı şöyle at” diye doğrudan tarif etmesine gerek kalmaz.
   - Model, “*Ben şu çözüm yollarını denedim, şu belirteç dizileri işe yaradı*” diye kendi deneyiminden öğrenir.
   - *En nihayetinde*, sorulan sorulara daha güvenilir ve daha tutarlı cevaplar vermeye başlar.

Bu işlem gerçek sistemlerde *binlerce* (hatta *milyonlarca*) farklı çözüm denemesi üzerinden yürür; model çok çeşitli problemlere karşı ürettiği cevapları değerlendirerek kendi parametrelerini *“doğru yapan”* yöne iter.

---

### **Örnek Uygulama: Hugging Face Inference Playground**

Videoda, **Hugging Face Inference Playground** arayüzü üzerinden gösterilen bir örnek vardı. *Llama 2 2B parametreli* (2 milyar parametre) küçük bir model alınarak, aynı problem defalarca çözdürülüyor. Her seferinde hafif farklı bir çözüm yolu izliyor ama doğru cevaba ulaşıyor.

Bu basit problemde küçük bir model bile çoğu zaman doğru cevabı (3 dolar) verebiliyor. Ancak **daha karmaşık** problemlerde doğruya ulaşmak her zaman garantili olmadığından, red (yanlış) çözümler de çıkıyor. *Reinforcement learning*, doğru çözümlerin “kredilendirilmesi” ve yanlış çözümlerin “caydırılması” şeklinde çalışarak, modelin performansını zamanla iyileştiriyor.

**Kısaca mekanizma şöyle gözüküyor**:

```lua
Prompt (İstem)  ---> Model çok sayıda çıktı üretir ---> Doğrular (yeşil), Yanlışlar (kırmızı)
                         |                                    |
                         |---- Reinforcement Learning --------|
                         |      "doğru yollara daha çok ağırlık ver"
```

Model doğru cevaplara giden belirteç dizilerini *teşvik*, yanlışlara giden dizileri de *bastırma* yönünde parametre güncellemeleri yapar.

---

### **SFT (Supervised Fine-Tuning - Denetimli İnce Ayar) ve RL Arasındaki İlişki**

Videoda anlatıldığı üzere, LLM eğitiminin temelde **üç aşaması** vardır:

1. **Pre-training (Ön eğitim)**
   
   - Devasa miktarda ham metin verisi (kitaplar, internet içerikleri vb.) üzerinde dil modeli eğitimi.
   - Bu aşamada model, genel dil istatistiklerini ve dünyayla ilgili temel bilgileri öğrenir.

2. **SFT (Supervised Fine-Tuning - Denetimli İnce Ayar)**
   
   - İnsan uzmanların doğru çözümlerini, açıklamalarını, “en iyi uygulamalarını” taklit etme aşaması.
   - Model, *uzman tarafından etiketlenmiş* veri setindeki giriş-çıkış eşleşmelerini öğrenerek “nasıl cevap verilir” sorusuna dair istatistiksel bir içgörü kazanır.
   - Fakat bu sadece **taklit** düzeyindedir; model, insan çözümlerini *motamot* benzetmeye çalışır.

3. **RL (Reinforcement Learning - Pekiştirmeli Öğrenme)**
   
   - Modelin artık kendi kendine pratik problem çözüp, doğru çözümlerini “ödüllendirerek” parametrelerini iyileştirme süreci.
   - Amaç, SFT ile belirli bir seviyeye getirilmiş modeli, *gerçekten* doğruyu güvenilir biçimde çıkaracak hale getirmektir.
   - Bu aşamada insanın her çözüme tek tek bakıp “Evet bu böyle yapılır” demesine gerek kalmaz. Model kendi çözümlerini deneyerek başarı veya başarısızlık geri bildirimi alır.

Bu üç aşama, tıpkı bir öğrencinin eğitim aşamalarına benzetilebilir:

- **Pre-training**: Ders kitaplarının hepsini okuyup genel bilgi edinmek.
- **SFT**: Öğretmenin çözdüğü örnek soruları inceleyerek o çözüm yolunu taklit etmek.
- **RL**: Kendi kendine pratik testler (deneme sınavları) çözerek, doğru yaptıklarından öğrenmek ve yanlış yaptıklarını düzeltmek.

---

### **Neden RL (Reinforcement Learning) Hâlâ Gelişim Aşamasında?**

Videoda, ilk iki aşamanın (pre-training ve SFT) alandaki herkes tarafından uzun süredir standart bir şekilde uygulandığı vurgulanıyor. Ancak:

- **RL aşaması**, sektörde nispeten daha *yeni* ve *deneysel* düzeydedir.
- Pek çok şirket (ör. OpenAI vb.) bu aşamayı kendi içlerinde denemiş olsa da, kamuya açık detaylar genelde sınırlı kalmıştır.
- RL’de “hangi çözümler seçilmeli?”, “öğrenme oranı nasıl ayarlanmalı?”, “hangi prompt (istem) dağılımlarıyla eğitmeli?” gibi **çok sayıda teknik detay** vardır.
- Bu detaylar pratikte büyük önem taşır çünkü yanlış ayarlar, modelin hatalı yönlerde uzmanlaşmasına veya stabil olmayan çıktılar vermesine neden olabilir.

Örneğin, yakın zamanda DeepSeek adlı bir yapı (videoda **Deep seek** veya **DeepSeek-R1** şeklinde bahsediliyor) bu konuda bir makale yayımlamış ve büyük ilgi çekmiştir. Bunun sebebi, şirketlerin kapalı kapılar ardında yaptığı RL çalışmalarını daha şeffaf ve detaylı şekilde ele almalarıdır.

---

### **Sonuç ve Özet**

- Bir LLM’in yalnızca insanlar tarafından etiketlenmiş (SFT) örneklerle eğitilmesi, **modelin bilişsel mekanizması** göz önüne alındığında her zaman optimal sonuç vermez.
- *Reinforcement learning (pekiştirmeli öğrenme)*, modelin kendi çözümlerini deneyerek doğru olanları içselleştirmesine ve yanlışlardan kaçınmasına olanak tanır.
- Tıpkı bir öğrencinin kitap okumayla (pre-training), öğretmen çözümlerini incelemeyle (SFT) ve deneme sınavlarıyla (RL) gelişmesi gibi, LLM’ler de bu üç adım sayesinde giderek daha iyi yanıtlar üretir.
- Bu süreçte, *LLM’lerin insanla aynı şekilde düşünmediği* ve *bizim kolay gördüğümüz bir şeyin model için zor olabileceği* veya tam tersinin mümkün olduğu unutulmamalıdır.
- RL henüz hızlı bir gelişim sürecinde olduğu için, gelecekte daha standart ve verimli hale gelmesi beklenmektedir.

---

İşte bu yüzden, **reinforcement learning (pekiştirmeli öğrenme)**, ChatGPT gibi büyük dil modellerinin (LLM) eğitiminde kritik bir aşama olarak karşımıza çıkar ve giderek daha fazla önem kazanmaktadır.

---

# DeepSeek-R1

## **Büyük Dil Modellerinde Takviyeli Öğrenmenin (Reinforcement Learning) Gücü**

Son dönemde yapay zeka dünyasında büyük yankı uyandıran **DeepSeek-R1** adlı çalışma, Çin merkezli **DC Kai** şirketi tarafından yayımlandı. Bu makale, **takviyeli öğrenme (reinforcement learning - RL)** ile büyük dil modellerinin (LLM) nasıl daha gelişmiş hale getirilebileceğini ele alıyor. Bu çalışma, büyük dil modellerine **akıl yürütme (reasoning) yetenekleri kazandırmada** takviyeli öğrenmenin kritik bir rol oynadığını ortaya koyuyor.

Bu makale, yalnızca akademik bir ilgi uyandırmakla kalmadı, aynı zamanda **RL tekniklerini kullanarak büyük dil modellerinin geliştirilmesi** sürecini detaylı bir şekilde açıklayarak, bu tür modelleri yeniden üretmek isteyenler için önemli bir kaynak sundu.

## **Matematik Problemlerinde Performans Artışı**

DeepSeek-R1 makalesinde vurgulanan önemli noktalardan biri, **dil modellerinin matematik problemlerini çözmedeki başarısının RL ile nasıl arttığıdır**. Aşağıdaki analiz, modelin belirli sayıda eğitim adımından sonra doğruluk oranının nasıl yükseldiğini gösteriyor:

- Başlangıçta model, verilen matematik problemlerini düşük bir doğrulukla çözüyor.

- Takviyeli öğrenme süreci boyunca model, **deneme-yanılma yöntemini** kullanarak problemleri daha yüksek doğrulukla çözmeyi öğreniyor.

- **Binlerce eğitim adımı sonrasında**, modelin doğruluk oranında belirgin bir iyileşme gözlemleniyor.

Ancak, **yalnızca niceliksel iyileşmeler değil, niteliksel değişimler de dikkat çekicidir**. RL ile eğitilen model, yalnızca doğru cevabı bulmakla kalmıyor, aynı zamanda **çözüm sürecini de optimize ediyor**.

## **Modelin Düşünme Süreci: Akıl Yürütmenin (Reasoning) Evrimi**

DeepSeek-R1'in önemli bir keşfi de, **modelin problem çözme stratejilerinin RL sürecinde evrimleşmesi** oldu. Modelin çıktıları analiz edildiğinde şu ilginç özellikler gözlemlendi:

- **Cevap uzunlukları artıyor**: Model, bir problemi çözerken daha uzun ve ayrıntılı çözümler üretmeye başlıyor.

- **Adım adım analiz yapıyor**: Model, "Bekleyin, burada bir hata olabilir, bunu adım adım yeniden değerlendirelim" gibi ifadeler kullanarak kendi çözümlerini tekrar kontrol ediyor.

- **Farklı bakış açıları geliştiriyor (try something from different perspectives)**: Problemleri çözerken **geri adım atma, yeniden çerçeveleme, alternatif yollar deneme (retrace, reframe, backtrack) gibi bilişsel stratejiler geliştiriyor**.

Bu stratejiler, insanların problem çözerken kullandığı bilişsel süreçlere benziyor (Matematiksel problem çözümünde sizin ve benim zihnimizde gerçekleşen akıl yürütme zincirlerinin (chains of thought) yeniden keşfedilmesidir). Ancak en dikkat çekici nokta, **bu yöntemlerin önceden programlanmamış olması**. Model, **tamamen kendiliğinden ve deneyerek bu teknikleri keşfediyor**. Yani, bir insan programcı bu akıl yürütme tekniklerini manuel olarak kodlamamış; model, **takviyeli öğrenme süreci içinde bunları kendi başına geliştiriyor**.

## Modelin Düşünme Süreci ve Akıl Yürütme Stratejileri

Burada inanılmaz olan şey, modelin **düşünme yolları** keşfetmesidir. Ben bu sürece, bir problemi nasıl manipüle edeceğiniz, ona farklı açılardan nasıl yaklaşacağınız, benzetmeler (analogies) kurmanız ve çeşitli stratejileri denemeniz olarak tanımladığım **bilişsel stratejiler (cognitive strategies)** diyorum.

- **Farklı stratejiler:** Model, zaman içinde birçok farklı deneme yaparak, sonucu farklı açılardan kontrol ediyor.
- **Öğrenme süreci:** Bu süreç tamamen *reinforcement learning* (RL / Pekiştirmeli Öğrenme) ile ortaya çıkıyor.
- **Otomatik keşif:** Modelin doğru cevabı almak için geliştirdiği bu yöntem, ona yalnızca doğru cevapların verilmesiyle otomatik olarak ortaya çıkıyor.

Bu durum, modelin akıl yürütme sürecini (thinking process) ortaya koyması açısından son derece etkileyici.

## **Rekabetçi LLM'ler: DeepSeek-R1 ve Diğer Düşünme Modelleri (Thinking Models)**

Günümüzde büyük dil modelleri **iki ana eğitim yöntemiyle geliştiriliyor**:

1. **Denetimli ince ayar (Supervised Fine-Tuning - SFT)**: Bu yöntemde, model **insan uzmanların verdiği örnekleri taklit eder**.

2. **Takviyeli öğrenme (Reinforcement Learning - RL)**: Model, **deneme yanılma yoluyla en iyi stratejileri kendiliğinden keşfeder**.

DeepSeek-R1, **takviyeli öğrenme kullanılarak eğitilmiş bir düşünme modeli (thinking model)** olarak öne çıkıyor. Günümüzde rekabetçi **düşünme modelleri** arasında şunlar bulunuyor:

- **DeepSeek-R1** (Chat.deepseek.com veya Together.ai üzerinden erişilebilir)

- **GPT-4 Turbo** (OpenAI'nin gelişmiş modelleri arasında yer alır)

- **Gemini 2.0 Flash (Google AI tarafından geliştirilmiştir)**

Ancak OpenAI'nin bazı modelleri, **gerçek akıl yürütme süreçlerini tam olarak göstermemektedir**. Örneğin, **GPT-4 Turbo** gibi modeller, arka planda RL teknikleriyle eğitilmiş olsalar da, **kullanıcılara yalnızca özetlenmiş akıl yürütme süreçleri sunmaktadır**. Bunun nedeni, **distillation risk** (damıtma riski) endişesidir; yani birisi bu izleri taklit ederek modelin akıl yürütme performansını elde edebiliıdır.



## **Düşünme Modellerinin Geleceği**

**Takviyeli öğrenme tabanlı düşünme modelleri** hâlâ gelişim aşamasında. Günümüzde bu tür modellerin kullanımı artarken, bazı teknik ve etik sorular da gündeme geliyor:

- **Performans Karşılaştırması**: GPT-4 ve DeepSeek-R1 gibi modellerin gerçek dünya uygulamalarındaki performansı nasıl ölçülmeli?

- **Gizlilik Endişeleri**: Çin merkezli DeepSeek-R1 gibi modellerin kullanımı, veri gizliliği açısından nasıl değerlendirilmelidir?

- **Erişilebilirlik**: Açık kaynak modeller (open weights models) ile ticari modeller arasındaki farklar kullanıcılar için ne anlama geliyor?

### **Takviyeli Öğrenmenin Geleceği: AlphaGo Bağlantısı**

Takviyeli öğrenmenin gücü, yalnızca dil modelleriyle sınırlı değildir. **Go oyunu** üzerine yapılan ünlü çalışmalarda da benzer bir yaklaşım kullanılmıştır:

- **AlphaGo (DeepMind)**: Takviyeli öğrenme ile eğitilen bu sistem, dünyanın en iyi Go oyuncularını yenmeyi başarmıştır.

- **Düşünme modelleri ve AlphaGo**: DeepSeek-R1 gibi modellerin geliştirilme süreci, AlphaGo’nun Go stratejileri öğrenme sürecine benzemektedir. **Deneme yanılma yoluyla en etkili stratejileri keşfetmek**, hem oyunlar hem de problem çözme süreçleri için geçerli bir yöntemdir.

## **Sonuç: Düşünme Modelleri Yeni Bir Dönemi Başlatıyor**

DeepSeek-R1 gibi **takviyeli öğrenme tabanlı düşünme modelleri**, yapay zeka dünyasında yeni bir çağ başlatıyor.

- **Matematik ve kodlama problemlerinde daha yüksek doğruluk sağlıyorlar.**

- **Kendi kendilerine yeni problem çözme stratejileri geliştiriyorlar.**

- **Takviyeli öğrenme, yapay zekaya "nasıl düşüneceğini" öğretmede önemli bir yöntem olarak öne çıkıyor.**

Bu modellerin önümüzdeki yıllarda daha fazla gelişmesi ve farklı alanlara uygulanması bekleniyor. **Düşünme modelleri, yalnızca dil işleme değil, bilim, mühendislik ve karar verme süreçlerinde de çığır açabilir.**

---

## **Derin Takviye Öğrenme ve LLM'lerin Evrimi**

### **AlphaGo ve Takviye Öğrenmenin Gücü**

Takviye öğrenmenin (Reinforcement Learning - RL) yapay zekâ dünyasında devrim yaratan bir yöntem olduğu yeni bir keşif değil. Bu yöntemin ne kadar güçlü olduğunu, Go oyunu üzerinde yapılan çalışmalarla gördük. DeepMind tarafından geliştirilen **AlphaGo**, insan oyunculara karşı kendi kendine öğrenerek oynayabilen bir sistemdir.

AlphaGo'nun temel stratejisi, oyun geçmişlerinden öğrenmek ve ardından **takviye öğrenme (Reinforcement Learning - RL)** kullanarak kendi oyununu geliştirmekti. Ancak, burada ilginç bir fark ortaya çıkıyor. AlphaGo’nun geliştirilmesinde kullanılan iki farklı model vardı:

1. **Denetimli Öğrenme (Supervised Learning) Modeli:** İnsan uzman oyuncuların oynadığı büyük miktarda oyunu taklit eden bir model. Bu model, insan oyunlarını taklit ederek belirli bir seviyeye kadar iyi oynayabilir. Ancak, bu yaklaşımın bir sınırı vardır: **İnsanların ötesine geçemez**. Yani, en iyi insan oyuncuların oynama stilini taklit ederek gelişebilir ama onları aşamaz.

2. **Takviye Öğrenme (Reinforcement Learning) Modeli:** Bu model, kendi başına oyun oynayarak ve kazanmaya yönelik hamleleri pekiştirerek öğrenir. Burada kritik olan nokta, modelin **insan oyunculara bağımlı olmaması** ve tamamen kazanma oranını artırmaya odaklanmasıdır. Böylece, insan oyuncuların sınırlarını aşarak **daha önce keşfedilmemiş hamleleri bulabilir**.

Bu yöntemin ne kadar güçlü olduğunu **ELO reytingi** (oyuncuların yetenek seviyelerini ölçen bir sistem) ile görebiliyoruz. AlphaGo’nun denetimli öğrenme modeli, güçlü insan oyuncular seviyesine ulaşırken, takviye öğrenme modeli bu sınırları aşarak en iyi insan oyuncuları bile geride bırakmıştır.

### **AlphaGo’nun Çığır Açan Hamlesi: 37. Hamle**

AlphaGo’nun en çok konuşulan ve şaşırtıcı hamlelerinden biri **"37. Hamle"** (Move 37) olarak bilinir. Bu hamle, o ana kadar hiçbir insan oyuncunun oynamayı düşünmediği bir hamleydi. İnsan uzmanların değerlendirmelerine göre, bu hamlenin bir insan tarafından oynanma ihtimali **10.000'de 1** olarak belirlenmişti. Ancak, sonradan anlaşıldı ki, bu hamle **stratejik olarak dahiyane bir hareketti**.

Bu olay, **takviye öğrenmenin en büyük gücünü** gözler önüne seriyor: İnsan deneyimiyle sınırlı olmayan, tamamen kazanma olasılığına odaklanan ve yeni stratejiler keşfedebilen bir öğrenme yöntemi. AlphaGo, **bilinen oyun stratejilerinin ötesine geçerek** yeni kazanma yolları buldu.

### **LLM'ler ve Takviye Öğrenmenin Yeni Ufukları**

Peki, bu kavramları büyük dil modellerine (Large Language Models - LLMs) nasıl uygulayabiliriz? Günümüzde LLM'ler genellikle **denetimli öğrenme (Supervised Learning)** ile eğitiliyor, yani büyük miktarda insan tarafından üretilmiş metinleri taklit ediyorlar. Ancak, bu yaklaşım **AlphaGo’nun insan oyuncuları taklit eden modeline benzer**. Bu yöntem, modeli çok iyi bir seviyeye getirebilir ama **insanların ötesine geçmesini sağlayamaz**.

Takviye öğrenme burada devreye giriyor. Eğer LLM'ler de **çeşitli problem çözme senaryolarında kendi kendilerine deneyerek öğrenmeye başlarlarsa**, insan düşüncesinin ötesinde yeni düşünme yolları keşfetmeleri mümkün hale gelir. Ancak, burada çok ilginç bir soru ortaya çıkıyor:

> **Bir yapay zekâ, insanların düşünme sınırlarını aşarak nasıl yeni çözümler üretebilir?**

Bu soruya yanıt ararken, birkaç olasılık öne çıkıyor:

- **Benzersiz Analojiler:** Yapay zekâ, insanların kuramayacağı yeni benzetmeler ve mantıksal bağlantılar keşfedebilir.

- **Yeni Düşünme Stratejileri:** İnsan beyninin izlediği geleneksel düşünme yollarını aşarak, alternatif akıl yürütme mekanizmaları geliştirebilir.

- **Yeni Diller:** Eğer mevcut dillerin düşünme sürecini kısıtladığını fark ederse, kendi özel dilini geliştirebilir. Bu, tamamen **daha verimli bir düşünme biçimi** olabilir.

### **Büyük Dil Modelleri için Takviye Öğrenmenin Önündeki Zorluklar**

Takviye öğrenmeyi büyük dil modellerine (LLM'lere) uygulamak, bazı önemli zorlukları da beraberinde getiriyor:

1. **Çeşitli ve Zengin Veri Setleri:** AlphaGo için oyun ortamı belliydi (Go oyunu), ancak dil modellerinde çözülmesi gereken problemler **çok daha geniş bir yelpazeye yayılıyor**. LLM'lerin gelişmesi için, **farklı bilgi alanlarında oluşturulmuş çok sayıda zorlu problem setine** ihtiyaç duyuluyor.

2. **Öğrenme Sürecinin Tanımlanması:** Takviye öğrenme, "kazanan hamleleri" pekiştirerek çalışıyor. Ancak, dil modellerinde bir çıktının **"iyi" ya da "kötü" olduğunu belirlemek** daha zor olabilir. Bu nedenle, **insan geri bildirimi ile takviye öğrenme (Reinforcement Learning from Human Feedback - RLHF)** giderek daha önemli hale geliyor.

3. **İnsan Bilgisinin Ötesine Geçmek:** AlphaGo'nun 37. hamlesinde olduğu gibi, bir dil modeli **insanların düşünmediği bir çözüm yolu keşfederse**, bunu nasıl değerlendireceğiz? Bir modelin sunduğu yeni bilgiyi "doğru" ya da "yanlış" olarak değerlendirmek için elimizde bir kıyas noktası olmayabilir.

### **Sonuç: LLM'lerin Geleceği ve Keşfedilmemiş Zekâ**

Büyük dil modelleri, şu an için **insan bilgisini taklit eden** sistemler olarak çalışıyor. Ancak, takviye öğrenme ile donatıldıklarında, **insan zekâsının sınırlarını aşan** yeni düşünme yolları keşfetme potansiyeline sahip olabilirler. Belki de ilerleyen yıllarda, yapay zekâların **insan aklının kavrayamayacağı yeni düşünme yöntemleri geliştirdiğini** göreceğiz.

Bunun nasıl gerçekleşeceğini tam olarak bilemiyoruz. Belki bu, **dilin ötesine geçerek tamamen farklı bir düşünme sistemi keşfetmek** anlamına gelecek. Belki de **insanların kuramadığı yeni mantıksal bağlantıları kurarak** dünyaya farklı bir bakış açısı getirecek. Ancak kesin olan bir şey var: **Takviye öğrenme, büyük dil modellerinin geleceğini şekillendiren en önemli alanlardan biri olacak.**
