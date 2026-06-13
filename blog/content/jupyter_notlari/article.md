# Jupyter İçin Temel Bilgiler

Jupyter, özellikle veri analizi, makine öğrenmesi ve hızlı deneysel çalışma için çok güçlü bir araçtır. Ancak verimli kullanmak için önce ortam kurulumunu doğru yapmak gerekir. Bu yazı, temiz bir başlangıç için en temel akışı özetler.

## Neden sanal ortam?

Jupyter'ı doğrudan sistem Python'una kurmak kısa vadede kolay görünür ama zamanla paket çakışmalarına yol açar. Özellikle farklı projelerde farklı `numpy`, `pandas` ya da `scikit-learn` sürümleri kullanıyorsanız, izole ortam şart hale gelir.

## Sanal ortam oluşturma

Windows üzerinde temel akış:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Aktivasyon sonrası terminal satırında ortam adı görünür. Bu, kuracağınız paketlerin artık proje seviyesinde izole olacağı anlamına gelir.

## Jupyter kurulumu

En temel kurulum:

```bash
pip install jupyterlab ipykernel
```

Burada iki ana parça var:

- `jupyterlab`: arayüz ve notebook deneyimi
- `ipykernel`: bu ortamın Jupyter içinde kernel olarak görünmesini sağlar

## Kernel kaydı

Oluşturduğunuz sanal ortamı Jupyter içinde seçilebilir hale getirmek için:

```bash
python -m ipykernel install --user --name myblog-env --display-name "Python (myblog-env)"
```

Bu komuttan sonra notebook açıldığında kernel listesinde ilgili ortam görünür.

## Jupyter nasıl başlatılır?

```bash
jupyter lab
```

veya klasik arayüz isteniyorsa:

```bash
jupyter notebook
```

Komut çalışınca tarayıcıda yerel bir arayüz açılır. Oradan yeni notebook oluşturabilir veya var olan dosyaları açabilirsiniz.

## VS Code ile çalışma

VS Code içinde Jupyter uzantısı yüklüyse `.ipynb` dosyaları doğrudan editörde açılır. Sağ üstte görünen kernel seçicisinden doğru ortam seçilmelidir. Bu adım atlanırsa hücreler yanlış Python ortamında çalışabilir.

Kontrol etmeniz gerekenler:

1. Doğru interpreter seçili mi?
2. Doğru kernel aktif mi?
3. Gerekli paketler bu ortama kurulu mu?

## Hızlı doğrulama

Kurulumun doğru olduğundan emin olmak için notebook içinde şu kod çalıştırılabilir:

```python
import sys
import pandas as pd

print(sys.executable)
print(pd.__version__)
```

Buradaki `sys.executable` çıktısı, beklediğiniz sanal ortamı işaret etmelidir.

## Sık yaşanan sorunlar

### Kernel görünmüyor

Çoğu zaman `ipykernel` kurulu değildir ya da kernel kaydı yapılmamıştır.

### Paket import edilmiyor

Paket yanlış ortama kurulmuştur. Terminalde aktif ortam ile notebook kernel'i aynı olmayabilir.

### Jupyter açılıyor ama notebook çalışmıyor

Kernel çökmüş olabilir veya Python interpreter bozuk seçilmiş olabilir. Kernel restart çoğu zaman ilk hızlı kontroldür.

## Temiz çalışma düzeni

Uzun vadede en sağlıklı yaklaşım şudur:

- Her proje için ayrı sanal ortam
- Gerekli paketleri `requirements.txt` içinde tutmak
- Notebook ile üretim kodunu mümkün olduğunca ayırmak

Notebook keşif için idealdir; kalıcı uygulama kodu ise modüler `.py` dosyalarına taşınmalıdır.

## Sonuç

Jupyter verimli bir çalışma alanıdır ama doğru ortam yönetimi olmadan hızla karışır. Sanal ortam, kernel kaydı ve doğru interpreter seçimi üçlüsü düzgün kurulduğunda hem VS Code hem tarayıcı tabanlı kullanım çok daha stabil hale gelir.