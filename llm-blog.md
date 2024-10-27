# Yapay Zeka Dünyasının Yeni Yıldızları: Large Language Models (LLM)

Yapay zeka teknolojisindeki en heyecan verici gelişmelerden biri, Large Language Models (LLM) yani Büyük Dil Modelleri'dir. Bu modeller, insanların günlük hayatını kolaylaştırmaktan tutun da, karmaşık problemlerin çözümüne kadar pek çok alanda devrim yaratıyor.

## LLM'ler Nasıl Çalışır?

LLM'ler, milyarlarca parametre içeren derin öğrenme modelleridir. Bu modeller, internet üzerindeki devasa miktardaki metin verisi üzerinde eğitilir. Transformer mimarisi sayesinde, verilen bir metni anlayabilir ve bağlama uygun yanıtlar üretebilirler.

## Günlük Hayattaki Uygulamaları

- Metin yazımı ve düzenleme
- Kod geliştirme desteği
- Dil çevirisi
- İçerik özetleme
- Soru-cevap sistemleri

Günlük Hayattaki Uygulamaları



## Örnek Python Uygulaması

Aşağıda, basit bir LLM API'si kullanımını gösteren Python kodu bulunmaktadır:

```python
import requests
import json

class SimpleLanguageModel:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.example.com/v1"

    def generate_text(self, prompt, max_tokens=100):
        """
        Verilen prompt'a göre metin üretir

        Args:
            prompt (str): Başlangıç metni
            max_tokens (int): Üretilecek maksimum token sayısı

        Returns:
            str: Üretilen metin
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": 0.7
            }

            response = requests.post(
                f"{self.base_url}/completions",
                headers=headers,
                json=payload
            )

            if response.status_code == 200:
                return response.json()["choices"][0]["text"]
            else:
                return f"Hata: {response.status_code}"

        except Exception as e:
            return f"Bir hata oluştu: {str(e)}"

    def summarize_text(self, text):
        """
        Verilen metni özetler

        Args:
            text (str): Özetlenecek metin

        Returns:
            str: Özetlenmiş metin
        """
        prompt = f"Aşağıdaki metni özetle:\n\n{text}\n\nÖzet:"
        return self.generate_text(prompt, max_tokens=150)

# Kullanım örneği
if __name__ == "__main__":
    model = SimpleLanguageModel(api_key="your_api_key_here")

    # Metin üretme örneği
    prompt = "Yapay zeka teknolojileri gelecekte..."
    generated_text = model.generate_text(prompt)
    print("Üretilen Metin:", generated_text)

    # Metin özetleme örneği
    text_to_summarize = """
    Yapay zeka, bilgisayarların insan zekasını taklit etmesini sağlayan 
    teknolojiler bütünüdür. Makine öğrenimi ve derin öğrenme gibi alt 
    dalları vardır. Günümüzde pek çok alanda kullanılmaktadır.
    """
    summary = model.summarize_text(text_to_summarize)
    print("\nÖzet:", summary)
```

DSDS

```python
import requests
import json


```

## Color Quantization Application

Görüntü işleme alanında, renkli bir resmi yalnızca sınırlı sayıda renk gösterebilen bir cihazda görüntülemek, görüntü kalitesini fazla kaybetmeden çözülmesi gereken yaygın bir problemdir. Renkli görüntüler genellikle her biri kırmızı, yeşil ve mavi bileşenleri temsil eden üç paralel matris olarak saklanır. Her bileşen 0 ile 255 arasında bir değere sahip olabilir, yani toplamda \(256^3\) (yaklaşık 16 milyon) renk temsil edilebilir. İnsan gözü bu kadar çok rengi ayırt edemediği için, görüntüyü temsil etmek için sınırlı sayıda rengi seçmek mantıklıdır.

K-means algoritması ile, renklerin belirli bir sayıda seviyeye indirgenmesi (kuantize edilmesi) sağlanabilir. Bu yöntem etkili olur çünkü insan gözü tüm renk spektrumunu algılayamaz. K-means'te, bu kuantize edilmiş renk seviyeleri "merkez noktaları" olarak kabul edilir. Her piksel için, en yakın merkez noktası, pikselin <r, g, b> olarak temsil edilen bir vektör gibi düşünülmesi ve piksel ile her merkez noktası arasındaki mesafe hesaplanarak bulunur. Algoritma, her merkez noktasına en yakın olan piksellerin ortalamasını alarak bir renk değeri atar.

Aşağıdaki resimlerde, k-means kullanılarak bir renkli görüntünün kuantize edilmesi sonucu elde edilen görüntüler görülmektedir. 256 seviyede kuantize edilmiş görüntü, orijinalinden neredeyse ayırt edilemez. Bu görüntüleri oluşturan kodun bağlantısını sayfanın en altında bulabilirsiniz.

<p align="center">
    <img src="Kmeans_orig.jpg" alt="Resim 1" width="24%">
    <img src="Kmeans_orig.jpg" alt="Resim 2" width="24%">
    <img src="Kmeans_orig.jpg" alt="Resim 3" width="24%">
    <img src="Kmeans_orig.jpg" alt="Resim 4" width="24%">
</p>

   

<p align="center">
    <a href="Kmeans_orig.jpg" target="_blank"><img src="Kmeans_orig.jpg" alt="Resim 1" width="24%"></a>
    <a href="Kmeans_orig.jpg" target="_blank"><img src="Kmeans_orig.jpg" alt="Resim 2" width="24%"></a>
    <a href="Kmeans_orig.jpg" target="_blank"><img src="Kmeans_orig.jpg" alt="Resim 3" width="24%"></a>
    <a href="Kmeans_orig.jpg" target="_blank"><img src="Kmeans_orig.jpg" alt="Resim 4" width="24%"></a>
</p>

## DS





## Sonuç

LLM'ler, yapay zeka teknolojisinde büyük bir atılım temsil ediyor. Gelecekte daha da gelişerek, hayatımızın vazgeçilmez bir parçası haline gelecekler. Bu teknolojinin sorumlu ve etik kullanımı, gelecekteki başarısı için kritik öneme sahip.
