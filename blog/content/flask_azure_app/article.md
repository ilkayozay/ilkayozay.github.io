# Azure App Servis ile Flask Uygulaması

Küçük bir Flask uygulamasını yerelde çalıştırmak kolaydır; asıl mesele onu tekrar üretilebilir biçimde yayınlayabilmektir. Bu yazı, VS Code merkezli bir akışla Flask uygulamasını GitHub'a gönderip Azure App Service üzerinde ayağa kaldırmak için pratik bir özet sunuyor.

## Genel akış

Temel yayın zinciri şöyledir:

1. Flask uygulamasını yerelde düzenli bir proje yapısıyla hazırlamak
2. Gerekli bağımlılıkları sabitlemek
3. Projeyi Git deposuna almak ve GitHub'a göndermek
4. Azure App Service üzerinde uygulamayı oluşturmak
5. Deployment kaynağını GitHub ile bağlamak
6. Ortam ayarlarını tanımlayıp yayını doğrulamak

## Proje yapısı

En sade haliyle şu dosyalar yeterlidir:

```text
my-flask-app/
	app.py
	requirements.txt
	startup.txt
```

Örnek uygulama:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
		return 'Azure App Service uzerinde Flask calisiyor.'

if __name__ == '__main__':
		app.run(debug=True)
```

Bağımlılıklar:

```text
Flask==3.0.3
gunicorn==22.0.0
```

Linux tabanlı Azure App Service dağıtımlarında `gunicorn` kullanmak en temiz seçimdir. Bunun için `startup.txt` içine şu komut yazılabilir:

```text
gunicorn --bind=0.0.0.0 --timeout 600 app:app
```

## Yerel doğrulama

Azure'a çıkmadan önce yerelde en az şu kontroller yapılmalı:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
flask --app app run
```

Bu adım önemlidir; deployment hatalarının önemli bir kısmı aslında daha önce yerelde görülebilecek import, paket ya da entrypoint problemleridir.

## Git ve GitHub akışı

Projeyi sürüm kontrolüne almak için:

```bash
git init
git add .
git commit -m "Initial Flask app"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

VS Code kullanıyorsanız Source Control paneli ile aynı adımları arayüz üzerinden de yönetebilirsiniz. Ama temel mantık aynıdır: Azure tarafı güvenilir bir kaynağa bağlanmalıdır.

## Azure App Service oluşturma

Azure portal üzerinden şu seçimler yapılır:

- Publish: Code
- Runtime stack: Python
- Operating System: Linux
- Region: size uygun bölge

Uygulama oluşturulduktan sonra Deployment Center bölümünde GitHub bağlantısı açılır. Repo ve branch seçildikten sonra Azure, push geldikçe otomatik deployment yapabilir.

## App settings

Yayın sırasında en çok sorun çıkan yerlerden biri ortam değişkenleridir. Şunları ayrı düşünmek gerekir:

- Gizli anahtarlar
- Veritabanı bağlantıları
- Debug bayrakları
- Üçüncü parti API anahtarları

Bu değerler doğrudan koda gömülmemeli, Azure App Service içindeki `Environment variables` bölümünden verilmelidir.

Örnek kullanım:

```python
import os

secret_key = os.getenv('SECRET_KEY', 'local-dev-key')
```

## Yayın sonrası kontrol listesi

Deployment tamamlandıktan sonra şu noktalar doğrulanmalı:

1. Ana route başarılı dönüyor mu?
2. Uygulama loglarında import hatası var mı?
3. `gunicorn` entrypoint doğru mu?
4. Ortam değişkenleri okunuyor mu?
5. Statik dosyalar gerekiyorsa doğru servis ediliyor mu?

## Sık karşılaşılan problemler

### `ModuleNotFoundError`

Genelde `requirements.txt` eksiktir ya da sürüm kilidi hatalıdır.

### Uygulama açılıyor ama 500 dönüyor

Çoğu zaman ortam değişkeni eksiktir veya startup komutu yanlış tanımlanmıştır.

### Yerelde çalışıyor, Azure'da çalışmıyor

Bu durum genellikle iki nedenden olur:

- Farklı Python sürümü
- Yerelde var olan ama requirements içinde olmayan paketler

## Sonuç

Flask uygulamasını Azure App Service'e taşımak zor değildir; zor olan kısmı akışı tekrarlanabilir hale getirmektir. Uygulama giriş noktası, bağımlılık listesi, deployment kaynağı ve ortam değişkenleri baştan düzenli kurulursa sonraki yayınlar çok daha sorunsuz ilerler.