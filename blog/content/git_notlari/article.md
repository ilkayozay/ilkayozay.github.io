# Basit Seviyede Git Notları

Git, dosyaların sadece son halini saklamak için değil, değişimin mantığını izlemek için kullanılır. Özellikle tek başına çalışan biri için bile geri dönme, karşılaştırma ve güvenli ilerleme imkanı sağlar.

## Yeni depo başlatmak

Bir klasörü Git deposuna çevirmek için:

```bash
git init
```

Bu komut klasör içine `.git` dizinini oluşturur ve artık yapılan değişiklikler izlenebilir hale gelir.

## İlk commit akışı

Temel akış genelde şu şekildedir:

```bash
git status
git add .
git commit -m "Ilk commit"
```

Burada:

- `git status` mevcut durumu gösterir
- `git add .` değişiklikleri staged alana taşır
- `git commit` bu değişiklikleri kalıcı bir sürüm noktası olarak kaydeder

## Uzak repo bağlamak

GitHub üzerinde repo oluşturduktan sonra yerel projeyi bağlamak için:

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

İlk push sonrası yerel dal ile uzak dal eşleşmiş olur.

## Günlük temel komutlar

En sık kullanılan komutlar şunlardır:

```bash
git status
git add <dosya>
git commit -m "Mesaj"
git pull
git push
git log --oneline
git diff
```

Bu küçük set bile günlük işlerin büyük kısmını karşılar.

## Commit mesajı nasıl olmalı?

İyi bir commit mesajı neyin değiştiğini söyler. Örnekler:

- `add markdown renderer for blog posts`
- `fix theme toggle on about page`
- `remove legacy html article flow`

Kötü örnekler:

- `update`
- `fix`
- `son hali`

Commit geçmişi aslında projenin teknik günlüğüdür; okunabilir olmalıdır.

## `git diff` neden önemli?

Commit atmadan önce `git diff` görmek çok değerlidir. Bu sayede yanlışlıkla eklenen debug logları, format gürültüsü veya ilgisiz dosya değişiklikleri fark edilir.

## Branch mantığı

Küçük projelerde herkes `main` üzerinde çalışabiliyor gibi görünür ama daha güvenli akış branch kullanmaktır:

```bash
git checkout -b feature/new-about-page
```

Bu sayede riskli değişiklikler ana hattı doğrudan bozmaz.

## Sık yapılan hatalar

### Yanlış dosyaları commit etmek

Özellikle `.venv`, büyük veri dosyaları veya geçici çıktılar `.gitignore` içinde tutulmalıdır.

### Çok büyük commitler

Tek commit içinde hem tasarım, hem içerik, hem refactor yapmak geçmişi okunmaz hale getirir.

### Commit atmadan önce test etmemek

Kod sürüm kontrolünde olsa da bozuk commit ileride maliyet yaratır.

## Basit bir `.gitignore` örneği

```gitignore
.venv/
__pycache__/
*.pyc
.DS_Store
node_modules/
dist/
```

## Sonuç

Git'in değeri sadece yedek almak değildir. Düşünülmüş commitler, temiz branch kullanımı ve düzenli diff kontrolü bir projeyi uzun vadede çok daha yönetilebilir hale getirir. Basit komutlarla başlamak yeterlidir; önemli olan akışı tutarlı hale getirmektir.