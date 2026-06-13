# Yapay Zeka Ajanları ile İş Akışları Geliştirme: Pratik Bir Kılavuz

## Giriş

Yapay Zeka (AI) alanındaki gelişmeler, yazılım geliştirme paradigmalarını temelden dönüştürmektedir. Bu dönüşümün merkezinde, **Yapay Zeka Ajanları (AI Agents)** olarak bilinen otonom sistemler yer almaktadır. Bir AI ajanı, belirli hedeflere ulaşmak için çevresini algılayan, kararlar alan ve eylemler gerçekleştiren bir varlıktır. Bu makale, AI ajanlarının temel yapılarını, geleneksel otomasyon sistemlerinden farklarını ve güncel kütüphaneler kullanılarak nasıl pratik ve ölçeklenebilir ajan takımları oluşturulabileceğini teknik bir yaklaşımla ele almaktadır.

## 1. AI Ajanı ve Geleneksel Otomasyon: Temel Farklılıklar

AI ajanlarını anlamanın ilk adımı, onları geleneksel, kural tabanlı otomasyon sistemlerinden ayıran temel yeteneği kavramaktır: **Muhakeme (Reasoning)**.

Geleneksel otomasyon, önceden tanımlanmış, katı kurallara dayalı bir `IF-THEN-ELSE` mantığıyla çalışır. Süreç deterministiktir; aynı girdi her zaman aynı çıktıyı üretir ve beklenmedik durumlar genellikle sistemin hata vererek durmasına neden olur.

AI ajanları ise, Büyük Dil Modelleri (LLM'ler) tarafından sağlanan muhakeme yeteneği sayesinde dinamik ve esnek bir yapıya sahiptir. Bu ajanlar, görevin bağlamını anlar, belirsiz durumlarla başa çıkmak için stratejiler geliştirir ve hedefe ulaşmak için en uygun adımı seçebilir. Bu süreç, genellikle **ReAct (Reason + Act)** gibi düşünce-eylem döngüleri ile modellenir. Ajan, önce durumu "düşünür" (Reason), bir eylem planı oluşturur ve ardından bu planı uygular (Act).

| Özellik | Geleneksel Otomasyon Sistemi | Yapay Zeka (AI) Agent'ı |
| :--- | :--- | :--- |
| **Karar Mekanizması** | Statik, kural tabanlı (Rule-Based) | Dinamik, muhakeme tabanlı (Reasoning-Based) |
| **Esneklik** | Düşük. Değişen koşullara adaptasyon yeteneği yoktur. | Yüksek. Yeni bilgilere ve beklenmedik durumlara adapte olabilir. |
| **Araç Kullanımı** | Sabit, önceden kodlanmış API çağrıları. | Görevin gerektirdiği aracı (API, fonksiyon, veritabanı) otonom olarak seçme ve kullanma yeteneği. |
| **Bağlam Anlayışı** | Yoktur. Sadece verilen spesifik komutu işler. | Görevin genel amacını ve bağlamını anlayarak hareket eder. |

### Ajan Yetkileri: Okuma (Read-Only) ve Yazma (Write)

Ajanların sistemler üzerindeki etki seviyesi, onlara atanan yetkilerle belirlenir. Bu, güvenlik ve yönetişim açısından kritik bir ayrımdır.

*   **Okuma Yetkili Ajanlar (Read-Only Agents):** Bu ajanlar, mevcut sistemlerin durumunu değiştirmeden bilgi toplar, analiz eder ve raporlar.
    *   **Uygulama Alanları:** Pazar araştırması yapmak, web sitelerinden veri kazımak, büyük doküman setlerini özetlemek, veritabanlarından sorgu çalıştırıp rapor oluşturmak.
    *   **Risk Seviyesi:** Düşük. En kötü senaryo, yanlış veya eksik bilgi sunmalarıdır.

*   **Yazma Yetkili Ajanlar (Write Agents):** Bu ajanlar, sistemlerde aktif değişiklikler yapma yetkisine sahiptir. Eylemleri, gerçek dünya sonuçları doğurur.
    *   **Uygulama Alanları:** Müşteri destek taleplerine yanıt olarak e-posta göndermek, takvime toplantı eklemek, bir veritabanına yeni kayıt girmek, bir bulut sunucusunu yeniden başlatmak, e-ticaret sitesinde ürün fiyatını güncellemek.
    *   **Risk Seviyesi:** Yüksek. Hatalı bir eylem (örn: yanlış bir müşteriye e-posta göndermek, kritik bir veriyi silmek) ciddi operasyonel veya finansal sonuçlara yol açabilir. Bu nedenle, "yazma" yetkisine sahip ajanlar için katı **koruma sınırları (guardrails)** ve onay mekanizmaları zorunludur.

## 2. Etkili Bir AI Ajanının Anatomisi: Temel Yapı Taşları

Bir AI ajanının performansı, onu oluşturan bileşenlerin ne kadar net ve eksiksiz tanımlandığına doğrudan bağlıdır. Etkili bir ajan tasarımı, aşağıdaki temel yapı taşlarını içermelidir:

*   **Rol (Role) ve Amaç (Goal):** Ajanın kimliğini ve varlık nedenini tanımlar. "Kıdemli Veri Analisti" gibi bir rol, ajanın kullanacağı dil tonunu ve önceliklerini belirlerken, "Son çeyrek satış verilerindeki anomalileri tespit edip raporlamak" gibi bir amaç, başarının ölçütünü netleştirir.

*   **Araçlar (Tools):** Ajanın amacına ulaşmak için kullanabileceği fonksiyonlar, API'ler veya diğer yeteneklerdir. Bir araç, bir arama motorunu sorgulayan bir fonksiyon, bir matematik hesaplayıcısı, bir veritabanı bağlantısı veya hatta başka bir uzman ajan olabilir. Araçların net bir şekilde tanımlanması, ajanın yetenek setinin sınırlarını çizer.

*   **Hafıza (Memory):** Ajanın önceki etkileşimleri ve adımları hatırlama kapasitesidir. Bu, bağlamın kaybolmasını önler.
    *   *Kısa Süreli Hafıza (örn: `ConversationBufferMemory`):* Mevcut konuşma veya görevin tamamını ham metin olarak tutar.
    *   *Özet Hafıza (örn: `ConversationSummaryMemory`):* Konuşmayı periyodik olarak özetleyerek daha uzun etkileşimleri yönetir.
    *   *Vektör Tabanlı Hafıza (örn: `VectorStoreRetrieverMemory`):* Geçmiş bilgileri vektör veritabanında saklayarak anlamsal olarak ilgili bilgileri geri getirmeyi sağlar.

*   **Koruma Sınırları (Guardrails):** Ajanın uyması gereken katı kurallar ve kısıtlamalardır. Bu, ajanın istenmeyen veya tehlikeli eylemlerde bulunmasını engeller. Örneğin: "Asla kişisel verileri içeren bir metni harici bir API'ye gönderme" veya "500$'dan fazla bir harcama için insan onayı iste."

*   **İş Akışı (Workflow/Process):** Ajanların veya görevlerin hangi sırayla çalışacağını belirleyen mantıktır. Bu, **sıralı (sequential)** olabilir, yani her ajan bir sonrakini tetikler, ya da **hiyerarşik (hierarchical)** olabilir, burada bir yönetici ajan görevleri alt ajanlara dağıtır.

## 3. AI Agent Geliştirme Ekosistemi: Kütüphaneler ve Platformlar

Sıfırdan bir ajan sistemi kurmak yerine, mevcut güçlü ve esnek kütüphanelerden yararlanmak en verimli yaklaşımdır. İşte piyasadaki en popüler dört seçenek:

### a) LangChain: Modülerlik ve Esneklik

LangChain, AI uygulamaları geliştirmek için en kapsamlı ve modüler açık kaynaklı kütüphanelerden biridir. Geliştiricilere ajanlar, zincirler (chains) ve araçlar gibi yapı taşlarını birleştirerek karmaşık uygulamalar oluşturma imkanı tanır.

**Örnek: Basit bir ReAct Ajanı Oluşturma**

Aşağıdaki örnek, LangChain kullanarak bir arama motoru ve bir hesap makinesini araç olarak kullanan basit bir ajan oluşturur. Ajan, "Tesla'nın piyasa değeri, Apple'ın piyasa değerinin yüzde kaçıdır?" gibi bir soruyu cevaplamak için önce arama yapacak, sonra hesaplama yapacaktır.

```python
# Gerekli kütüphaneleri yükleyin
# pip install langchain langchain-openai duckduckgo-search

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_openai import OpenAI

# LLM'i başlat
llm = OpenAI(temperature=0)

# Araçları yükle: DuckDuckGo arama ve LLM tabanlı hesap makinesi
tools = load_tools(["ddg-search", "llm-math"], llm=llm)

# Agent'ı başlat
# AgentType.ZERO_SHOT_REACT_DESCRIPTION, ajanın ReAct mantığını kullanmasını söyler
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True # Ajanın düşünce sürecini görmek için
)

# Agent'ı çalıştır
question = """What is the current market cap of Tesla and what is the current market cap of Apple? 
What percentage of Apple's market cap is Tesla's?"""
agent.run(question)
```
Bu kod çalıştırıldığında, ajanın adım adım düşündüğünü, önce Tesla'nın değerini aradığını, sonra Apple'ın değerini aradığını ve son olarak bu iki değeri kullanarak bir hesaplama yaptığını `verbose=True` sayesinde görebilirsiniz.

### b) CrewAI: İşbirliğine Dayalı Ajan Takımları

CrewAI, özellikle birden fazla ajanın bir "ekip" (crew) olarak birlikte çalıştığı senaryolar için tasarlanmış üst düzey bir kütüphanedir. Her ajana belirli bir rol ve görev atanmasını ve bu ajanların bir iş akışı içinde işbirliği yapmasını kolaylaştırır.

**Örnek: Pazar Araştırma Ekibi**

Bu örnek, bir önceki yanıtta verilen pazar araştırma ekibini (Araştırmacı, Analist, Stratejist) CrewAI ile nasıl oluşturacağımızı gösterir. Bu yapı, her ajanın tek bir sorumluluğa odaklandığı (Single Responsibility Principle) modüler bir tasarım sunar.

```python
# Gerekli kütüphaneleri yükleyin
# pip install crewai crewai_tools

import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

# API anahtarlarını ortam değişkeni olarak ayarlayın
os.environ["OPENAI_API_KEY"] = "SENIN_API_ANAHTARIN"
os.environ["SERPER_API_KEY"] = "SENIN_SERPER_ANAHTARIN"

# Araçları tanımla
search_tool = SerperDevTool()

# Roller (Agents)
researcher = Agent(
  role='Kıdemli Pazar Araştırmacısı',
  goal='Hızlı şarj teknolojisi pazarındaki ana rakipleri ve ürünlerini bul',
  backstory="Teknoloji pazarlarını analiz etmede uzmansın.",
  tools=[search_tool]
)
analyst = Agent(
  role='Teknoloji Ürün Analisti',
  goal='Rakiplerin ürünlerinin teknik özelliklerini, fiyatlarını ve müşteri yorumlarını analiz et',
  backstory="Detaylara önem veren bir analistsin."
)
# ... Diğer ajanlar da benzer şekilde tanımlanır ...

# Görevler (Tasks)
task1 = Task(description="...", agent=researcher, expected_output="...")
task2 = Task(description="...", agent=analyst, expected_output="...")

# Ekip (Crew)
market_research_crew = Crew(
  agents=[researcher, analyst],
  tasks=[task1, task2],
  process=Process.sequential
)

result = market_research_crew.kickoff()
print(result)
```

### c) AutoGen (Microsoft): Çoklu Ajan Konuşmaları

AutoGen, Microsoft Research tarafından geliştirilen ve ajanlar arasında karmaşık konuşma ve işbirliği akışları oluşturmaya odaklanan bir kütüphanedir. Temelinde, bir `AssistantAgent` (görevi çözen AI) ve bir `UserProxyAgent` (insanı temsil eden, kod çalıştıran ve geri bildirim veren ajan) bulunur.

**Örnek: Kod Yazma ve Yürütme Görevi**

Bu örnekte, `UserProxyAgent`, `AssistantAgent`'tan bir Python betiği yazmasını ister. `AssistantAgent` kodu yazar ve `UserProxyAgent` bu kodu çalıştırarak sonucunu geri bildirir.

```python
# Gerekli kütüphaneleri yükleyin
# pip install pyautogen

import autogen

# LLM yapılandırması
config_list = [
    {
        'model': 'gpt-4',
        'api_key': 'SENIN_API_ANAHTARIN',
    }
]

# Assistant Agent (görevi yapan)
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list}
)

# User Proxy Agent (insanı taklit eden, kodu çalıştıran)
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "coding_folder"}
)

# Görevi başlat
user_proxy.initiate_chat(
    assistant,
    message="""Plot a chart of the first 10 Fibonacci numbers and save it to a file named 'fibonacci.png'."""
)
```
Bu betik, iki ajanın bir sorunu çözmek için nasıl diyalog kurduğunu, kod yazdığını ve yürüttüğünü simüle eder.

### d) Google Cloud Vertex AI Agents: Kurumsal ve Yönetilen Çözüm

Google, kurumsal düzeyde, ölçeklenebilir ve güvenli ajanlar oluşturmak için yönetilen bir platform olan **Vertex AI Agents**'ı sunar. Bu platform, geliştiricilerin kod yazmak yerine, doğal dil kullanarak ajanları ve araçlarını yapılandırmasına olanak tanır.

**Yaklaşım:**
1.  **Ajan Oluşturma:** Google Cloud konsolunda bir ajan oluşturulur ve ona bir amaç verilir (örn: "Müşteri sipariş durumunu sorgulama").
2.  **Araçları Bağlama:** Ajana, Google Cloud hizmetleri (BigQuery, Cloud Functions), SaaS API'leri (Salesforce, Zendesk) veya özel şirket içi API'ler gibi araçlar bağlanır.
3.  **Doğal Dil ile Yapılandırma:** Araçların ne işe yaradığı ve hangi parametreleri aldığı doğal dille tanımlanır. Örneğin: `getCustomerOrder(order_id: string)` fonksiyonu için "Müşterinin sipariş numarasını kullanarak sipariş detaylarını getirir" şeklinde bir açıklama girilir.
4.  **Test ve Dağıtım:** Ajan, yerleşik simülatörde test edilir ve ardından bir API endpoint'i olarak dağıtıma alınır.

Bu yaklaşım, kodlama yükünü azaltır ve ajanı Google'ın altyapısıyla (güvenlik, loglama, ölçeklenebilirlik) entegre eder, bu da onu büyük ölçekli kurumsal uygulamalar için ideal kılar.

## Sonuç: Mimari ve Strateji

Başarılı AI ajanı sistemleri, en karmaşık veya en çok araca sahip olanlar değil, en iyi tasarlanmış olanlardır. Etkili bir ajan mimarisi, aşağıdaki prensiplere dayanmalıdır:

*   **Modülerlik:** Her ajanın tek bir, iyi tanımlanmış sorumluluğu olmalıdır. Bu, sistemin test edilmesini, bakımını ve ölçeklenmesini kolaylaştırır.
*   **Net Arayüzler:** Ajanların kullandığı araçlar, beklenen girdileri ve çıktıları açıkça belirten sağlam API'ler veya fonksiyonlar olmalıdır.
*   **Doğru Aracı Seçmek:** Projenin ihtiyacına göre doğru kütüphane veya platform seçilmelidir. Hızlı prototipleme ve esneklik için **LangChain**, işbirliğine dayalı takımlar için **CrewAI**, karmaşık ajan diyalogları için **AutoGen** ve kurumsal düzeyde yönetilen bir çözüm için **Google Vertex AI Agents** uygun seçeneklerdir.

Yapay zeka ajanları, otomasyonun bir sonraki evrimidir. Onları doğru prensipler ve araçlarla inşa etmek, sadece verimliliği artırmakla kalmaz, aynı zamanda daha önce mümkün olmayan yeni nesil akıllı uygulamaların da kapısını aralar.