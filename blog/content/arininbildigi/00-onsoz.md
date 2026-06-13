# Ön Söz

Bu kitabın adını koymak, kendisini yazmaktan neredeyse daha zordu — ve denediğim isimler, aslında anlatmak istediğim şeyin farklı yüzleriydi. Bir ara adı *Maliyetin Saklandığı Yer* olacaktı; çünkü kitabın tek takıntısı bu: bir zekânın ödediği bedel nereye gizlenir? Bir ara *Sıkıştırılmış Dünya* dedim; çünkü mesele, bir zekânın neyi tutup neyi atmayı göze aldığıdır. Bir ara, tek kelimeyle, *Latency* — gecikme — demeyi düşündüm; çünkü göreceğimiz gibi, bilgiyi hep elinin altında tutmak yerine gerektiğinde gidip almak, bir kusur değil belki de en zarif çözümdür. Sonunda *Arının Bildiği*'nde karar kıldım. Çünkü diğer bütün başlıklar bir fikre işaret ediyordu; bu ise bir *canlıya* — meselenin soyut değil, kanlı canlı, milyonlarca yıldır uçan bir kanıtı olduğuna.

Şimdi o arıya gelelim.

Bir bal arısının beyninde yaklaşık bir milyon nöron var. Bizim beynimizdekinin yüz binde biri kadar; toplu iğne başından küçük bir doku. Ama dikkat edin, asıl şaşırtıcı olan bu küçüklük değil, o küçüklüğe sığdırılan iştir. O bir milyon nöronla arı uçuyor; rüzgârı düzeltiyor, çiçeği renginden ve kokusundan tanıyor, kovana kilometrelerce uzaktan yön buluyor, gördüğü yeri bir dansa çevirip arkadaşlarına tarif ediyor. Bütün bunları, bir LED ampulü yakmaya yetmeyecek kadar minik bir güçle, birkaç haftalık ömrünün tamamında topu topu birkaç kilojoule enerjiyle yapıyor. Yani mesele "azıcık beyinle idare etmek" değil; inanılmaz ölçüde optimize edilmiş, küçük ama savurganlıktan arınmış bir beyinle çok şey başarmak.

Şimdi bu tabloyu aklınızda tutun ve bugünün büyük yapay zekâ modellerine bakın. Burada iki ayrı fatura var ve bu kitap boyunca onları asla karıştırmayacağız, çünkü ayrımları meselenin tam kalbinde. Birincisi *eğitim* faturası: bir modeli baştan kurmak, dünya çapında veri merkezleri, aylarca süren hesap, kasabaları besleyecek elektrik demektir — milyarlarca arının bütün ömrünü toplasanız yanına yaklaşamayacağı bir enerji. İkincisi *kullanım* faturası: eğitilmiş bir modele tek bir cümle tamamlatmak. Bu çok daha küçüktür. Ama yine de, bugünün ölçümleri o tek cümlenin bile bir kilojoule mertebesinde —yani küçük bir arının yoğun bir gününün, yaşamının anlamlı bir kesitinin harcadığı enerji mertebesinde— bir bedeli olabileceğini söylüyor. Düşünün: koca bir veri merkezinin bir köşesi, bir çırpıda, küçük bir canlının günlerce süren telaşı kadar enerji yakıyor; üstelik sadece bir cümle için.

Kolay olan, buradan bir hayranlık çıkarmaktır: "demek doğa ne kadar zarif, makinelerimiz ne kadar kaba." Kolay olan ama yanlış olan. Çünkü arı bedava değildir. Onun o bir milyon nöronu, o davranışları üreten o devre, milyonlarca yıllık bir eğitimin çıktısıdır. O *kullanım* faturası bu kadar küçük görünüyorsa, sebebi *eğitim* faturasının çoktan ödenmiş olmasıdır — evrim ödemiştir, ve hesabı arının kanat şekline, gözüne, içgüdüsüne sessizce gömmüştür. Arı ucuz görünüyor çünkü pahalı kısım görünmez yerde duruyor.

İşte bu kitabın tek bir takıntısı var, ve o da bu görünmez yer: **maliyet nereye saklanır?**

Bir zekâ, dünyayla baş edebilmek için bir bedel öder. Ama bu bedeli her zaman aynı yere koymaz. Bazen her şeyi önceden öğrenip devreye gömer — arı böyle yapar, donmuş ve hazır; faturayı atası ödemiştir. Bazen az şey gömer, gerisini dışarıda bırakır ve lazım olunca gidip bakar — insan böyle yapar; ansiklopediyi ezberlemeyiz, kavramı tutarız, bilgiye erişiriz, ve o bilgi ihtiyaç anında zihnimizde keskinleşir. Bazen de hiçbir şeyi atmayı göze alamaz, her seferinde her şeyi baştan hesaplar — bugünün büyük modelleri çoğu zaman böyle yapar, ve faturayı her kelimede yeniden öderler.

Bu kitabın iddiası şu:

> Zekâ, çok bilmek değildir; neyi bilmemeyi göze alabileceğini ve o boşluğa gerektiğinde nasıl ucuza ulaşacağını bilmektir.

Sıkıştırmak, atmak, ertelemek, yeniden bulmak — asıl sanat burada.

Bu bakışla, modern yapay zekânın bütün omurgasını sıfırdan kuracağız. Bir kelimenin nasıl sayıya döndüğünden başlayıp, sıkıştırmanın doğuşuna, hayal gücünün matematiğine, dikkatin neden icat edilmek zorunda kaldığına, transformer'ın neden hem bu kadar güçlü hem bu kadar pahalı olduğuna kadar gideceğiz. Hiçbir kavramı hazır kabul etmeyeceğiz. Her birini, onu doğuran *acıyla* birlikte anlatacağım — çünkü hiçbir icat keyiften doğmaz; her biri bir öncekinin çöktüğü, tıkandığı, yetmediği yerden doğar. Tarih, acıların sırasıdır. Bu kitabı izlemenin en dürüst yolu da budur.

Yol boyunca arada bir beyne, arıya, hippocampusa, bir nörolojik hastanın bozulan dünyasına bakacağız. Ama dikkat: bunlar konunun kendisi değil. Bunlar, "demek başka türlü de olabiliyormuş" diyebilmemiz için orada duran kanıtlar. Asıl meselemiz yapay zekâyı kemiklerine kadar anlamak — ve onu daha verimli kurmanın mümkün olup olmadığını sormak.

Sormak diyorum, çözmek değil. Bu kitap bir reçeteyle bitmiyor. Son sayfada elinizde bir mucize mimari olmayacak; bunun yerine, bugünkü yapay zekânın *tam olarak nerede çatladığının* dürüst bir haritası olacak. İcadı size bırakıyorum. Çünkü bir zamanlar, ortada hiçbir şey yokken birinin enerji ile kütleyi tek bir denklemde eşitleme cesaretini göstermesi gibi, bu alandaki bir sonraki cesur denklem de henüz yazılmadı. Belki sizinki olur.

Bir uyarı borçluyum. Bu kitap kolay benzetmelere düşkün değil. "Beyin bir bilgisayardır", "dikkat tıpkı insandaki dikkat gibidir", "hatırlamak tıpkı bir modelin üretmesi gibidir" cümlelerini bolca kuracağız — ve sonra her birini kendi elimizle kıracağız. Çünkü bir benzetmenin en çok öğrettiği an, parladığı an değil, *çatırdadığı* andır. Çatırdadığı yer, gerçeğin kendini ele verdiği yerdir.

Matematikten kaçmayacağız ama içinde boğulmayacağız da. Her bölümde, isteyen için bir kutu olacak: kavramın matematiği, ve onu somutlaştıran kısa, çalışan kod parçaları. İsteyen o kutuyu atlayıp hikâyeyle devam edebilir; mesele kaybolmaz. Ama atlamamanızı öneririm. Bir fikri gerçekten anladığınızı, ancak otuz satırda kendi elinizle kurabildiğinizde anlarsınız.

Şimdi en baştan başlayalım. Bir bilgisayar "kedi" kelimesini tutamaz. Yalnızca sayı tutabilir. O hâlde ilk sorumuz şu: bir dünya, nasıl sayıya döner — ve bu dönüşümde neyi kaybederiz?
