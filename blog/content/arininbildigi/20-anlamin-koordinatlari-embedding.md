# Anlamın Koordinatları: Embedding

Geçen bölümün sonunda elimizde tuhaf bir miras kalmıştı. İki bin yılda inşa edilmiş muhteşem bir uzayımız vardı — istediğimiz kadar boyutlu, içinde uzaklık ve açı ölçebildiğimiz, Pisagor'dan Descartes'a uzanan bir uzay. Ve o uzaya koyacak tek bir anlamlı şeyimiz yoktu. One-hot, kelimeleri uzaya *fırlatmıştı* ama *yerleştirmemişti*: kedi köpeğe tam olarak araba kadar uzaktı, çünkü yerleri biz, alfabetik sıra kadar keyfî bir kuralla dağıtmıştık. Acı netti: yakınlığı ölçebiliyorduk ama yakın koyamıyorduk.

Bu acının çözümü, yirminci yüzyılın ortasında, bilgisayarlardan bile önce, dilbilimcilerin masasında filizlendi. Fikir o kadar yalın ki ilk duyduğunuzda "bu kadar mı?" diyebilirsiniz; ama modern yapay zekânın yarısı bu tek cümlenin üzerinde duruyor:

> Bir kelimeyi, birlikte gezdiği arkadaşlarından tanırsın.

Cümlenin sahibi İngiliz dilbilimci J. R. Firth'tür; aynı yıllarda Zellig Harris benzer fikri daha biçimsel bir kalıba döktü, ve felsefe tarafında Wittgenstein "bir kelimenin anlamı, dildeki kullanımıdır" diyerek aynı kapıya çoktan dayanmıştı. Bugün buna **dağılımsal hipotez** deniyor: benzer bağlamlarda geçen kelimeler, benzer anlamlar taşır.

Bunu bana inanarak değil, kendi zihninizde yaşayarak kabul etmenizi isterim. Size hiç bilmediğiniz bir kelime vereyim: *zartap.* Şu an hiçbir şey ifade etmiyor, değil mi? Şimdi üç cümle: "Sabah bir bardak soğuk zartap içtim." — "Bu zartap çok ekşi olmuş." — "Pazardan iki kilo zartap aldım, sıkıp suyunu çıkaracağım." Durun ve fark edin: zihninizde bir şey *oluştu.* Zartap muhtemelen bir meyve; muhtemelen narenciye; greyfurt gibi bir şey, belki turunç. Kimse size tanım vermedi, sözlük açılmadı. Kelimenin yalnızca *arkadaşlarını* gördünüz — bardak, soğuk, ekşi, kilo, sıkmak — ve anlam, o komşuluktan kendi kendine damıtıldı. Üç cümlede yaptığınız bu şey, makineye öğreteceğimiz numaranın ta kendisidir. Tek fark ölçek: sizin üç cümleniz vardı; makineye milyarlarcasını vereceğiz.

Peki bu güzel fikir nasıl sayıya döner? İlk ve en dürüst yol, insanlığın en eski yöntemidir: saymak.

---

Elinizde büyük bir metin yığını olsun — gazeteler, romanlar, ansiklopediler. Her kelime için şunu sayın: bu kelime, hangi kelimelerin yakınında, kaç kez geçti? Sonuç dev bir tablodur: satırlar kelimeler, sütunlar yine kelimeler, hücreler birlikte-geçme sayıları. "Kedi" satırında gezinirseniz "mama", "tüy", "miyav", "uyudu" sütunlarında kabarık sayılar görürsünüz; "karbüratör" sütununda sıfır. "Köpek" satırı, şaşırtıcı ölçüde benzer bir desen çizer. Ve işte kritik gözlem: **bu tabloda her satır zaten bir vektördür.** Kedinin satırı, kedinin arkadaş profilidir — ve köpeğin profiline benzediği için, iki vektör arasındaki kosinüs benzerliği yüksek çıkar. Geçen bölümde kurduğumuz alet, ilk kez gerçek bir anlam yakalamıştır. One-hot'un öldürdüğü şey, dirilmiştir.

Ama bu ham tablonun iki derdi vardır, ve ikisi de eski tanıdıklarımızdır. Birincisi boyut: elli bin kelimelik bir dilde tablo elli bin sütun genişliğindedir — one-hot'un israfına arka kapıdan geri döndük. İkincisi seyreklik ve gürültü: hücrelerin ezici çoğunluğu sıfırdır, dolu olanlar da tesadüflerle kirlidir; "kedi" bir kez "karbüratör"le aynı cümleye düşmüşse, tablo bunu da sadakatle kaydeder. 1990'da bir grup araştırmacının **LSA** (Latent Semantic Analysis) adıyla önerdiği çözüm, bu kitabın ana temasının ders kitabı örneğidir: tabloyu *sıkıştır.* Doğrusal cebirin SVD denen aleti, o devasa tabloyu en çok bilgi taşıyan birkaç yüz yöne izdüşürür; tesadüfler ve gürültü kırpılır, geriye desenin özü kalır. Elli bin sütun, anlamı taşıyan birkaç yüz sayıya iner. Ortaya çıkan kısa, yoğun vektörlere bugün **embedding** diyoruz — kelimenin, anlam uzayına *gömülü* koordinatları.

::: kutu | Kutu 2 — Otuz satırda anlam haritası

Feynman'ın karatahta ilkesini ilk kez gerçek bir fikre uyguluyoruz: LSA'yı kendi elimizle, en yalın haliyle kuracağız. Minicik bir derlemde birlikte-geçmeleri sayacağız, tabloyu SVD ile iki boyuta sıkıştıracağız, ve Kutu 1'deki kosinüs benzerliğiyle anlamı ölçeceğiz.

```python
import numpy as np

cumleler = [
    "kedi mama yedi", "kopek mama yedi", "kedi uyudu",
    "kopek havladi", "kedi fare kovaladi", "kopek kedi kovaladi",
    "araba yolda gitti", "kamyon yolda gitti",
    "araba benzin yakti", "kamyon benzin yakti",
]
kelimeler = sorted({k for c in cumleler for k in c.split()})
idx = {k: i for i, k in enumerate(kelimeler)}

M = np.zeros((len(kelimeler), len(kelimeler)))
for c in cumleler:                       # komsuluk penceresinde say
    ks = c.split()
    for i, k in enumerate(ks):
        for j in range(max(0, i-2), min(len(ks), i+3)):
            if i != j:
                M[idx[k], idx[ks[j]]] += 1

U, S, Vt = np.linalg.svd(M)              # tabloyu sikistir
E = U[:, :2] * S[:2]                     # kelime basina iki sayi!

def yakinlik(a, b):
    va, vb = E[idx[a]], E[idx[b]]
    return va @ vb / (np.linalg.norm(va) * np.linalg.norm(vb))

yakinlik("kedi", "kopek")    # yuksek  -> ayni mahalle
yakinlik("araba", "kamyon")  # yuksek  -> ayni mahalle
yakinlik("kedi", "araba")    # dusuk   -> uzak semtler
```

On cümle ve iki boyutla bile uzay kendiliğinden ikiye ayrılır: canlılar bir mahallede toplanır, taşıtlar ötekinde. Kimse modele "kedi bir hayvandır" demedi; harita, yalnızca komşuluk istatistiğinden çıktı — Şekil 1-1'in sağ paneli, on satır veriyle bile kurulmaya başladı. Gerçek sistemler milyarlarca cümle ve birkaç yüz boyut kullanır; ama fikir, bu otuz satırdakinin aynısıdır.

:::

---

Sayım yolu dürüsttü ama hantal kaldı: tablo devasa, SVD pahalı, yeni veri geldikçe her şey baştan. 2003'te Yoshua Bengio'nun ekibi farklı bir kapı araladı — embedding'i saymak yerine *öğrenmek* — ve 2013'te Google'da Tomas Mikolov'un ekibi bu kapıyı **Word2Vec** ile ardına kadar açtı.

Word2Vec'in dehası, anlam yerleştirme gibi felsefi görünen bir işi, bir *tahmin oyununa* çevirmesidir. Oyun şudur: modele milyarlarca kez, metinden çekilmiş bir kelime gösterilir ve sorulur — "ortadaki kelime bu; komşuları ne olabilir?" Model her kelimeye uzayda bir yer verir ve her yanlış tahminde o yerleri azar azar kaydırır. Başka hiçbir kural yoktur. Ama oyunu iyi oynamanın tek bir yolu vardır, ve model onu keşfetmek zorundadır: benzer bağlamlarda geçen kelimeleri uzayda yan yana koymak. "Kedi"yi gördüğünde "mama"yı tahmin edebilmek, "köpek"i gördüğünde de "mama"yı tahmin edebilmek istiyorsan, kedi ile köpeği komşu yapmaktan ucuz bir çözüm yoktur. Dağılımsal hipotez modele öğretilmez; oyunun kazanma stratejisi olarak *kendiliğinden ortaya çıkar.* Bu, kitap boyunca tekrar tekrar karşılaşacağımız bir desendir: doğru oyunu kurarsan, istediğin davranış kural olarak değil, *sonuç* olarak gelir.

Bu hikâyenin içinde, kitabımızın takıntısına dokunan nefis bir ayrıntı da saklı. Oyunun her turunda model, "komşu hangisi?" sorusunu aslında elli bin kelimelik bir aday listesi üzerinden cevaplamak zorundadır — her turda elli bin ihtimali tartmak, kaçtığımız sayım tablosu kadar pahalıdır. Mikolov'un ekibinin **negatif örnekleme** dediği hile, bu faturayı yırtıp atar: elli bin ihtimalin hepsiyle uğraşma; gerçek komşuyu, torbadan rastgele çekilmiş beş-on *sahte* komşudan ayırt etmeyi öğren, yeter. Maliyet binlerce kat düşer; sonuç neredeyse aynı kalır. Bunu bir kenara not edin, çünkü kitabın tezinin minyatürüdür: **büyük sıçramalar çoğu zaman daha çok hesaplayarak değil, neyi hesaplamamanın yeterli olduğunu keşfederek gelir.** Arının bildiği şeyin, silikondaki ilk yankısı.

Ve sonra, sihir göründü. Eğitilmiş bir Word2Vec uzayında vektörlerle *aritmetik* yapılabiliyordu:

**kral − erkek + kadın ≈ kraliçe**

Bu denklemin söylediği şey baş döndürücüdür: uzayda yalnızca *yakınlık* değil, *yön* de anlam taşır. "Erkek'ten kadın'a giden ok" ile "kral'dan kraliçe'ye giden ok" neredeyse aynı oktur — uzayın bir köşesinde, kimsenin çizmediği bir *cinsiyet yönü* belirmiştir:

<figure>
<svg width="100%" height="220" viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="okr2" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><polygon points="0 0, 8 3.5, 0 7" fill="#b5121b"/></marker>
  </defs>
  <circle cx="150" cy="160" r="5" fill="#14181c"/><text x="150" y="185" font-family="DejaVu Sans" font-size="10" fill="#14181c" text-anchor="middle">erkek</text>
  <circle cx="360" cy="150" r="5" fill="#14181c"/><text x="360" y="175" font-family="DejaVu Sans" font-size="10" fill="#14181c" text-anchor="middle">kadın</text>
  <circle cx="185" cy="62" r="5" fill="#14181c"/><text x="185" y="50" font-family="DejaVu Sans" font-size="10" fill="#14181c" text-anchor="middle">kral</text>
  <circle cx="395" cy="52" r="5" fill="#b5121b"/><text x="395" y="40" font-family="DejaVu Sans" font-size="10" font-weight="bold" fill="#b5121b" text-anchor="middle">kraliçe</text>
  <line x1="158" y1="159" x2="348" y2="151" stroke="#b5121b" stroke-width="2.2" marker-end="url(#okr2)"/>
  <line x1="193" y1="61" x2="383" y2="53" stroke="#b5121b" stroke-width="2.2" marker-end="url(#okr2)"/>
  <text x="268" y="135" font-family="DejaVu Sans" font-size="9" fill="#b5121b" font-style="italic" text-anchor="middle">aynı ok: "cinsiyet yönü"</text>
  <line x1="155" y1="150" x2="181" y2="74" stroke="#bbb" stroke-width="1.3" stroke-dasharray="4,4"/>
  <line x1="365" y1="140" x2="391" y2="64" stroke="#bbb" stroke-width="1.3" stroke-dasharray="4,4"/>
  <text x="540" y="95" font-family="DejaVu Sans" font-size="9.5" fill="#555">kraliçe ≈ kral − erkek + kadın</text>
  <text x="540" y="115" font-family="DejaVu Sans" font-size="8.5" fill="#999">kral'dan başla, erkekliği çıkar,</text>
  <text x="540" y="129" font-family="DejaVu Sans" font-size="8.5" fill="#999">kadınlığı ekle: kraliçeye varırsın</text>
</svg>
<figcaption><b>Şekil 2-1.</b> Anlam aritmetiği. İki kırmızı ok — erkek→kadın ve kral→kraliçe — neredeyse aynı vektördür. Uzay, kimse istemeden, içinde bir "cinsiyet yönü" örgütlemiştir; aynı uzayda çoğul yönü, zaman yönü, başkentlik yönü de bulunur: Ankara − Türkiye + Fransa sizi Paris'in yakınına bırakır.</figcaption>
</figure>

Kimse bu yönleri tasarlamadı. Milyarlarca cümlenin istatistiği, birkaç yüz boyuta sıkıştırılınca, içinden bir anlam geometrisi döküldü. Sagan'ın Kozmik Takvim'i neyse, bu da onun dilbilimdeki akrabasıdır: kavranamayacak kadar büyük bir şey —bir dilin bütün kullanım tarihi— kavranabilir bir haritaya iner, ve harita, kimsenin çizmediği yollar gösterir.

İnsan beyni tarafına burada yalnızca bir pencere açıp geçeceğiz, çünkü hak ettiği derinliği ileride alacak. Beyindeki kavramlar da tek bir "kedi nöronunda" değil, geniş nöron topluluklarının örüntülerinde, dağıtık biçimde yaşar — ve benzer kavramların örüntüleri örtüşür. Bu kadarıyla benzerlik gerçek. Ama insanın "köpek" temsiline havlama sesi, tüy dokusu, bir çocukluk korkusu, bir sahiplenme sevinci de gömülüdür; Word2Vec'in "köpek"i ise yalnızca kelime komşuluğudur. Bu farkın ne kadar derin olduğunu, sırası geldiğinde Oliver Sacks'in gerçek bir hastasıyla, hak ettiği ağırlıkta tartacağız.

Şimdi ise bu bölümün asıl borcunu ödeme vakti. Çünkü buraya kadar anlattıklarım fazla pürüzsüzdü — ve bu kitabın sözü var: her benzetmeyi kendi elimizle kıracağız.

::: catlak | Çatlak — Bu uzay anlamı mı biliyor, alışkanlığı mı?

Feynman, Caltech mezunlarına verdiği meşhur konuşmada bilimin birinci ilkesini şöyle koymuştu: *"Kendini kandırmamalısın — ve en kolay kandıracağın kişi sensin."* Az önce size anlam aritmetiğini gösterirken kendimizi tam olarak nerede kandırmış olabiliriz? Dört yerde.

**Birincisi:** o meşhur kral−kraliçe denklemi, vitrine konmuş seçilmiş bir örnektir. Aynı uzayda binlerce analoji denerseniz çoğu tutmaz; tutanlar makalelere girer, tutmayanlar sessizce çöpe gider. Sihir gerçektir — ama reklamı yapıldığı kadar güvenilir değildir.

**İkincisi:** Türkçedeki "yüz" kelimesini düşünün — surat, sayı, yüzmek fiilinin kökü. Word2Vec bu üç ayrı anlamı **tek bir vektöre** sıkıştırmak zorundadır; sonuç, üçünün ortasında, hiçbirine ait olmayan bulanık bir noktadır. Statik embedding'in yapısal acısı budur: kelimeye tek bir adres verir, oysa anlam cümleden cümleye taşınır. Bu sızıyı aklınızda tutun — kitabın ilerleyen bölümlerinde "bağlama göre değişen temsil" fikrini doğuracak olan tam da budur.

**Üçüncüsü:** uzay, veriye gömülü önyargıyı da aynı sadakatle öğrenir. Metinlerde "doktor" erkek zamirleriyle, "hemşire" kadın zamirleriyle birlikte geçiyorsa, uzayda doktor−erkek+kadın işlemi sizi hemşireye götürebilir. Model ahlaksız değildir; aynadır. Ama aynayı karar sistemlerinin içine koyduğunuzda, yansıma hükme dönüşür.

**Ve dördüncüsü, en derini:** bu uzay, "acı" kelimesinin biber, kayıp ve ilaç kelimelerine komşu olduğunu bilir. Peki *acıyı* bilir mi? Kelimenin kullanımını kusursuz haritalamak, kelimenin işaret ettiği deneyime dokunmak mıdır? Bu soruya hızlı bir cevap vermeyeceğiz; kitap boyunca birkaç kez geri dönüp her seferinde biraz daha derin kazacağız. Şimdilik dürüst tespit şu: embedding, anlamın *gölgesini* olağanüstü bir hassasiyetle ölçer. Gölge, çoğu iş için yeter. Ama gölgenin cisim olmadığını unutan, duvara toslar.

:::

---

Bölümün muhasebesini tutalım — ve dikkat edin, defterimiz bu kez ilk gerçek zaferini kaydediyor.

::: defter | Defter — Embedding

| Sıkıştırıldı | Tutuldu | Yeniden Hesaplandı |
|---|---|---|
| Milyarlarca cümlenin birlikte-geçme istatistiği, kelime başına birkaç yüz sayıya gömüldü. Eğitim faturası bir kez ödendi; anlam geometrisi ağırlıklara yazıldı. | Kelime başına tek bir yoğun vektör — bir arama tablosu. Erişim neredeyse bedava: kelimeyi ver, adresini al. | Hiçbir şey. Ve işte madalyonun öbür yüzü: "yüz" kelimesi her cümlede aynı adrese gider. Bağlam yok, esneme yok — statik anlamın bedeli. |

:::

One-hot'la yan yana koyun: orada hiçbir şey öğrenilmiyor, her şey ham tutuluyordu. Burada ilk kez tablo tersine döndü — devasa bir deneyim küçük ve kullanışlı bir öze sıkıştırıldı, fatura eğitime bir kez yazıldı, kullanım ucuzladı. Arının stratejisine gerçekten benzeyen bir şeyi ilk kez yaptık. Ama defterin üçüncü sütunu, bir sonraki acının adresini şimdiden fısıldıyor: hiçbir şeyi yeniden hesaplamayan sistem, bağlama da uyum sağlayamaz.

O acıya gelmeden önce, cevaplanması gereken daha temel bir soru var. Bu bölümde sıkıştırmayı SVD'ye ve bir tahmin oyununa yaptırdık — ama ikisi de kelimelere özel reçetelerdi. Ya elimizdeki şey kelime değilse? Bir yüz fotoğrafı, bir kalp ritmi, bir motor sesi? Genel soru şudur: **bir makineye, herhangi bir verinin özünü kendi kendine bulmayı nasıl öğretiriz?** Bir sonraki bölümde, sıkıştırmanın kendisini öğrenen makineyle tanışacağız — kendini daraltıp yeniden kurmaya mahkûm edilmiş o garip yapıyla: autoencoder.

::: derin | Daha derini için

Dağılımsal hipotezin kökleri için Firth (1957) ve Harris (1954); sayım yolunun zaferi için Deerwester ve arkadaşlarının LSA makalesi (1990). Word2Vec için Mikolov ve arkadaşlarının 2013 tarihli iki makalesi; akraba ve rakip olarak GloVe (Pennington, 2014) ile kelime-altı parçalara inen FastText. Ders kitabı düzeyinde en temiz anlatım, Jurafsky ve Martin'in *Speech and Language Processing* kitabının vektör anlambilimi bölümüdür. Önyargı meselesinin ölçülmüş hali için Bolukbasi ve arkadaşlarının "Man is to Computer Programmer as Woman is to Homemaker?" (2016) makalesi hem ürkütücü hem öğreticidir.

:::
