
**(Giriş)**

Vay canına, ne kadar çok kişi var burada. Herkese merhaba.

Evet, bugün burada sizinle yapay zeka çağında yazılım hakkında konuşacağım için heyecanlıyım. Bana birçoğunuzun lisans, yüksek lisans, doktora öğrencisi olduğu ve sektöre girmek üzere olduğunuz söylendi. Bence şu an sektöre girmek için gerçekten eşsiz ve çok ilginç bir zamandayız. Bunun temel sebebinin de yazılımın *tekrar* değişiyor olması olduğunu düşünüyorum.

"Tekrar" diyorum çünkü aslında bu konuşmayı daha önce de yapmıştım. Ama sorun şu ki, yazılım o kadar hızlı değişiyor ki, sürekli yeni konuşmalar hazırlayacak kadar çok malzemem oluyor. Ve bu değişim oldukça temel bir düzeyde. Kabaca söylemek gerekirse, yazılım yaklaşık 70 yıldır bu kadar temel bir seviyede pek değişmedi, ancak son birkaç yılda sanırım iki kez oldukça hızlı bir şekilde büyük bir değişim yaşadı. Bu da yapılacak çok büyük miktarda iş, yazılacak ve yeniden yazılacak çok fazla yazılım olduğu anlamına geliyor.


### **Yazılımın Evrimi: 1.0'dan 3.0'a**

Birkaç yıl önce, yazılımın değiştiğini ve yeni bir tür yazılımın ortaya çıktığını fark ettim ve buna o zamanlar **Yazılım 2.0** adını verdim. Buradaki fikir şuydu:

*   **Yazılım 1.0**, bildiğimiz, bilgisayar için yazdığımız koddur (Python, C++ vs.).
*   **Yazılım 2.0** ise temelde sinir ağlarıdır, özellikle de bir sinir ağının *ağırlıklarıdır (weights)*. Bu kodu doğrudan siz yazmazsınız; daha çok veri setlerini ayarlarsınız ve bir optimize edici çalıştırarak bu sinir ağının parametrelerini oluşturursunuz.

O zamanlar sinir ağları, karar ağacı gibi farklı bir sınıflandırıcı olarak görülüyordu. Ama bu yeni çerçeve daha uygundu. Artık Yazılım 2.0 dünyasının da bir GitHub'ı var: **Hugging Face**. Hugging Face, Yazılım 2.0 için GitHub ne ise odur. Orada yazılmış tüm modelleri görselleştirebilirsiniz.

Yani özetle:
*   **Yazılım 1.0:** Bilgisayarı programlayan kod.
*   **Yazılım 2.0:** Sinir ağlarını programlayan ağırlıklar.

Yakın zamana kadar bildiğimiz tüm sinir ağları, "görüntüden kategoriye" gibi sabit işlevliydi. Asıl temel değişiklik, sinir ağlarının **Büyük Dil Modelleri (LLM'ler)** ile programlanabilir hale gelmesiyle yaşandı. Ben bunu yepyeni bir bilgisayar türü olarak görüyorum. Bu yüzden ona **Yazılım 3.0** gibi yeni bir isim vermenin değerli olduğunu düşünüyorum.

*   **Yazılım 3.0**'da, sizin yazdığınız **"prompt"lar (komutlar)** artık LLM'leri programlayan programlar haline geldi. Ve işin en dikkat çekici yanı, bu komutların İngilizce gibi doğal bir dilde yazılması. Bu çok ilginç bir programlama dili.

Örneğin, duygu analizi yapmak istiyorsanız:
1.  **Yazılım 1.0:** Python'da bir miktar kod yazabilirsiniz.
2.  **Yazılım 2.0:** Bir sinir ağı eğitebilirsiniz.
3.  **Yazılım 3.0:** Bir LLM'e komut (prompt) verebilirsiniz.

Artık GitHub'daki kodların sadece kod olmadığını, aralarına serpiştirilmiş bir sürü İngilizce metin olduğunu fark etmişsinizdir. Bu, yeni bir kod türünün büyüyen bir kategorisi. Bu sadece yeni bir programlama paradigması değil, aynı zamanda bunun bizim ana dilimiz olan İngilizce ile yapılması da beni hayrete düşürüyor.

Tesla'dayken Otopilot üzerinde çalışıyorduk ve arabanın kendi kendine gitmesini sağlamaya çalışıyorduk. O zamanlar şöyle bir gözlemde bulunmuştum: Otopilot'ta bir sürü C++ kodu (Yazılım 1.0) vardı ve arada görüntü tanıma yapan bazı sinir ağları (Yazılım 2.0) bulunuyordu. Zamanla Otopilot'u daha iyi hale getirdikçe, sinir ağları yetenek ve boyut olarak büyüdü. Bununla birlikte, tonlarca C++ kodu silindi. Yazılım 1.0 ile yapılan birçok işlev, Yazılım 2.0'a taşındı. Yazılım 2.0 yığını, kelimenin tam anlamıyla Yazılım 1.0 yığınını "yedi".

Şimdi aynı şeyi tekrar görüyoruz. Yeni bir yazılım türü (Yazılım 3.0) ortaya çıktı ve mevcut yığınları "yiyor". Artık üç tamamen farklı programlama paradigmamız var. Eğer sektöre giriyorsanız, her üçünde de akıcı olmanız çok iyi bir fikir. Çünkü hepsinin artıları ve eksileri var.

### **LLM'ler: Altyapı, Fabrika ve İşletim Sistemleri**

Şimdi LLM'lerin ne olduğunu, bu yeni bilgisayarın ve ekosisteminin neye benzediğini düşünelim. Yıllar önce Andrew Ng, "Yapay zeka yeni elektriktir" demişti. Bu çok doğru bir noktaya değiniyor. LLM'ler kesinlikle bir **altyapı hizmeti (utility)** gibi davranıyor:
*   OpenAI gibi laboratuvarlar, sermaye harcayarak (capex) LLM'leri eğitiyor (elektrik şebekesi kurmak gibi).
*   Sonra bu zekayı API'ler üzerinden bize sunuyorlar (opex) ve biz de kullandığımız token başına ödeme yapıyoruz.
*   Bu API'lerden düşük gecikme süresi, yüksek erişilebilirlik, tutarlı kalite gibi taleplerimiz var. Tıpkı elektrik gibi.

Ama LLM'ler aynı zamanda birer **fabrika (fab)** gibi de düşünülebilir. Çünkü onları inşa etmek için gereken sermaye harcaması devasa. Bu teknoloji hızla gelişiyor ve Ar-Ge sırları bu LLM laboratuvarlarında merkezileşiyor.

Fakat bence en anlamlı benzetme, LLM'lerin birer **işletim sistemi (Operating System)** olması. Çünkü bu, musluktan akan elektrik veya su gibi basit bir emtia değil. Bunlar giderek daha karmaşık hale gelen yazılım ekosistemleri.
*   Piyasada Windows/macOS gibi birkaç kapalı kaynaklı sağlayıcı ve Linux gibi bir açık kaynak alternatifi olduğu gibi, LLM'ler için de birkaç kapalı kaynak sağlayıcı (OpenAI, Anthropic) ve Llama ekosistemi gibi açık kaynak bir alternatifimiz var.

Bu farkındalıkla bir şema çizmeye çalıştım: LLM yeni bir bilgisayarın işlemcisi (CPU) gibi, bağlam penceresi (context window) belleği (RAM) gibi ve bu işletim sistemi, problem çözmek için bellek ve işlem gücünü yönetiyor.

### **Yeni LLM İşletim Sistemi ve Tarihsel Benzerlikler**

Sanki bilgisayar dünyasının **1960'larındayız**. LLM işlem gücü çok pahalı, bu yüzden bulutta merkezileşmiş durumdalar ve biz hepimiz ona ağ üzerinden bağlanan ince istemcileriz (thin clients). Hiçbirimiz bu bilgisayarları tam kapasite kullanamıyoruz. Bu yüzden **zaman paylaşımı (time-sharing)** mantıklı geliyor. Bilgisayarlar eskiden tam olarak böyleydi. Kişisel bilgisayar devrimi henüz yaşanmadı çünkü ekonomik olarak mantıklı değil.

Bir başka benzetme: Ne zaman ChatGPT ile doğrudan metin üzerinden konuşsam, kendimi terminal aracılığıyla bir işletim sistemiyle konuşuyormuş gibi hissediyorum. Henüz genel amaçlı bir **grafiksel kullanıcı arayüzü (GUI)** icat edilmedi.

Ancak LLM'ler, erken dönem bilgisayarlardan önemli bir şekilde ayrılıyor: **Teknoloji yayılımının yönünü tersine çeviriyorlar.** Genellikle elektrik, kriptografi, internet gibi dönüştürücü teknolojileri önce devletler ve şirketler kullanır, sonra tüketicilere yayılır. LLM'lerde ise bu durum tam tersi. İlk bilgisayarlar balistik hesaplamaları için kullanılırken, LLM'ler "yumurta nasıl haşlanır?" gibi sorulara cevap veriyor. Bu sihirli yeni bilgisayarın bir orduya değil de bana yumurta haşlamada yardım etmesi büyüleyici.

### **LLM'lerin Psikolojisi: İnsansı Ruhlar ve Bilişsel Gariplikler**

LLM'leri programlamadan önce, onların ne olduğunu anlamak için biraz zaman harcamalıyız. Ben onları **"insansı ruhlar" (people spirits)** olarak düşünmeyi seviyorum. Onlar, otoregresif bir Transformer (bir sinir ağı türü) tarafından oluşturulan, insanların stokastik (olasılıksal) simülasyonlarıdır.

*   **Süper Güçleri:** Ansiklopedik bilgiye ve hafızaya sahipler. Bu bana, telefon rehberini okuyup tüm numaraları ezberleyebilen otistik bir savantı anlatan *Rainman* filmini hatırlatıyor.
*   **Bilişsel Eksiklikleri:**
    *   **Halüsinasyon görürler:** Olmayan şeyleri uydururlar.
    *   **Pürüzlü zekaları vardır:** Bazı alanlarda insanüstüyken, "strawberry" kelimesinde iki 'r' olduğunu iddia etmek gibi hiçbir insanın yapmayacağı hatalar yapabilirler.
    *   **Anterograd amnezi yaşarlar:** Yani yeni bilgileri kalıcı hafızalarına alamazlar. Bir iş arkadaşınız zamanla şirket kültürünü öğrenir, uzmanlaşır. LLM'ler bunu doğal olarak yapamaz. Bağlam pencereleri (context window) sadece bir "çalışma belleği" gibidir. *Memento* veya *50 İlk Öpücük* filmlerindeki karakterler gibi, her sabah hafızaları sıfırlanır.
    *   **Güvenlik açıkları:** Çok saftırlar, "prompt injection" saldırılarına karşı savunmasızdırlar ve verilerinizi sızdırabilirler.

Dolayısıyla, bu bilişsel eksiklikleri olan ama aynı zamanda insanüstü güçlere sahip varlıkları nasıl programlayacağımızı ve onlarla nasıl çalışacağımızı öğrenmeliyiz.

### **LLM Uygulamaları Tasarlamak: Kısmi Otonomi**

En büyük fırsatlardan biri, **kısmi otonom (partial autonomy)** uygulamalar. Örneğin kodlama yaparken doğrudan ChatGPT'ye gidip kodları kopyala-yapıştır yapabilirsiniz. Ama neden bunu yapasınız ki? Bunun için özel bir uygulama kullanmak çok daha mantıklı.

**Cursor** gibi uygulamalar, ilk LLM uygulamalarının harika bir örneğidir.
*   **Bağlam yönetimini** sizin için yapar.
*   Birden fazla LLM çağrısını **orkestre eder** (dosyaları anlamak için embedding modelleri, sohbet için chat modelleri vb.).
*   Uygulamaya özel bir **GUI (grafiksel arayüz)** sunar. Bir kod değişikliğini kırmızı ve yeşil renklerle görmek, metin okumaktan çok daha kolaydır. GUI, insanın bu hatalı sistemlerin işini denetlemesini sağlar.
*   Bir **"otonomi kaydırıcısı" (autonomy slider)** sunar. Sadece bir kelimeyi tamamlayabilir (düşük otonomi), bir kod bloğunu değiştirebilir veya tüm projeyi değiştirmesine izin verebilirsiniz (tam otonomi).

<p align="center">
    <img src="tesla_autonomy_slider.jpg" alt="Autonomy Slider" width="75%">
</p>
**Perplexity** de benzer özelliklere sahip başarılı bir LLM uygulamasıdır. Bilgiyi paketler, kaynakları göstererek denetlemenize olanak tanır ve "hızlı arama" ile "derin araştırma" arasında bir otonomi kaydırıcısı sunar.

### **İnsan-Yapay Zeka İşbirliği Döngülerinin Önemi**

Artık yapay zekalarla işbirliği yapıyoruz. Genellikle onlar **üretir**, biz insanlar **doğrularız**. Bu döngüyü olabildiğince hızlandırmak bizim yararımıza. Bunun iki yolu var:
1.  **Doğrulamayı hızlandırmak:** GUI'lar bu konuda çok önemlidir. Görsel şeyler beynimize giden bir otoyol gibidir.
2.  **Yapay zekayı tasmasından tutmak (keep the AI on the leash):** Yapay zeka ajanları konusunda insanlar aşırı heyecanlı. Ama bana 10.000 satırlık bir kod değişikliği sunulması işime yaramaz. O değişikliğin hata içermediğinden emin olmak zorunda olan kişi benim. Darboğaz hâlâ benim.

Yapay zekanın aşırı tepkisel bir ajan gibi davranması yerine, küçük ve kontrol edilebilir adımlarla ilerlemek çok daha verimlidir.

### **Tesla Otopilot'tan ve Iron Man'den Alınan Dersler**

Tesla'da 5 yıl boyunca kısmi otonomi üzerine çalıştım. Otopilot'un da bir GUI'si (gösterge panelindeki görselleştirme) ve bir otonomi kaydırıcısı vardır.

Size bir hikaye anlatayım: İlk kez 2013'te sürücüsüz bir araca bindim. Waymo'da çalışan bir arkadaşım beni Palo Alto'da gezdirdi. Sürüş mükemmeldi, sıfır müdahale vardı. O zaman "Vay canına, sürücüsüz araçlar çok yakında hayatımızda olacak" diye düşündüm. Ama işte 12 yıl sonra, hâlâ otonomi üzerinde çalışıyoruz. Yazılım da böyledir. Bu yüzden "2025 ajanların yılı olacak" gibi şeyler duyduğumda endişeleniyorum. Hayır, bu **ajanların on yılı** olacak.

Aklıma hep **Iron Man zırhı** gelir. Bu zırh hem bir **güçlendirme (augmentation)** aracıdır (Tony Stark onu kullanır) hem de bir **ajandır (agent)** (kendi kendine uçar). Bu, otonomi kaydırıcısıdır. Bu aşamada, gösterişli otonom ajan demoları yapmak yerine, Iron Man **zırhları** gibi kısmi otonomi ürünleri yapmalıyız. Bu ürünlerin özel GUI'ları olmalı ki insan-yapay zeka döngüsü çok hızlı işlesin.

### **Vibe Coding: Herkes Artık Bir Programcı**

Yeni programlama paradigması sadece otonomi sağlamakla kalmıyor, aynı zamanda İngilizce gibi doğal bir dille yapıldığı için **birdenbire herkes bir programcı haline geliyor.** Bu daha önce hiç görülmemiş bir şey. Eskiden bir şeyler yapabilmek için 5-10 yıl okumanız gerekirdi, artık durum böyle değil.

Buna **"Vibe Coding"** deniyor. Bu, özellikle var olmayan, tamamen özel bir şeyi sırf keyif için yapmak istediğinizde harikadır. Ben hiç Swift bilmememe rağmen bir günde basit bir iOS uygulaması yaptım. İnanılmazdı.

Ama asıl ilginç olan şuydu: Bir menünün fotoğrafını çekip yemeklerin resimlerini üreten **MenuGen** adlı bir uygulama yaptım. Kodlama kısmı, yani "vibe coding" kısmı birkaç saat sürdü ve işin kolay tarafıydı. Asıl zor olan, onu gerçeğe dönüştürmeye çalıştığımda başladı: kimlik doğrulama, ödemeler, alan adı, sunucuya yükleme... Bu DevOps işleri bir hafta sürdü ve hepsi tarayıcıda bir yerlere tıklayarak yapılıyordu. Çok sinir bozucuydu. Bir kütüphane bana "şu URL'ye git, bu menüye tıkla, şunu seç" diye talimatlar veriyordu. Madem biliyorsun, sen yapsana! Ben neden yapıyorum?

### **Ajanlar İçin İnşa Etmek: Geleceğe Hazır Dijital Altyapı**

Bu yüzden konuşmamın son kısmı şu: **Ajanlar için inşa edebilir miyiz?** Ben bu işleri yapmak istemiyorum.

Artık dijital bilgiyi işleyen yeni bir tüketici kategorisi var: **Ajanlar.** Onlar insan gibiler ve bizim yazılım altyapımızla etkileşime geçmeleri gerekiyor. Onlar için bir şeyler inşa edebilir miyiz?
*   Web sitenizde `robots.txt` dosyası olduğu gibi, `llm.txt` gibi bir dosya olabilir. Bu dosya, LLM'e bu alan adının ne hakkında olduğunu basit bir dille anlatır.
*   Dokümantasyonların çoğu insanlar için yazılmıştır (listeler, resimler). LLM'ler bunları doğrudan anlayamaz. Artık Vercel ve Stripe gibi şirketler, dokümantasyonlarını LLM'lerin kolayca anlayabileceği **Markdown** formatında sunuyor.
*   Dokümantasyonlarınızdaki "buraya tıklayın" gibi ifadeleri değiştirmelisiniz. Vercel, her "tıkla" ifadesini, bir ajanın çalıştırabileceği bir `curl` komutuyla değiştiriyor.

Elbette gelecekte LLM'ler tıklama yapabilecek, ancak onlarla **yarı yolda buluşmak** ve işlerini kolaylaştırmak yine de çok değerli.

### **Özet: LLM'lerin 1960'larındayız - İnşa Etme Zamanı**

Sektöre girmek için ne kadar harika bir zaman!
*   Tonlarca kodu yeniden yazmamız gerekiyor.
*   LLM'ler birer altyapı hizmeti, fabrika ama en çok da **işletim sistemi** gibiler. Ama daha 1960'lardayız.
*   Bu LLM'ler, birlikte çalışmayı öğrenmemiz gereken hatalı "insansı ruhlar".
*   Kısmi otonomi ürünleri yaratmalıyız.
*   Ve en önemlisi, **otonomi kaydırıcısını** yavaş yavaş soldan (güçlendirme) sağa (ajan) doğru kaydıracağız.

Önümüzdeki on yılda bu kaydırıcıyı soldan sağa kaydıracağız. Bunun neye benzeyeceğini görmek çok ilginç olacak ve bunu hepinizle birlikte inşa etmek için sabırsızlanıyorum.

Teşekkür ederim.