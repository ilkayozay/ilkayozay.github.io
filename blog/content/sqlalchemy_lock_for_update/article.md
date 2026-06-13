# Python SQL Alchemy LOCK meselesi

Bir veritabanında aynı kaydın birden fazla worker tarafından aynı anda işlenmesini engellemek gerektiğinde, satır seviyesinde kilitleme kritik hale gelir. Bu yazıdaki temel fikir, SQLAlchemy içinde `with_for_update()` kullanarak okunan kaydı transaction tamamlanana kadar kilitlemektir.

## Problem

Varsayalım ki bir tabloda gönderilecek mailler tutuluyor ve birden fazla worker bu kayıtları işliyor.

- Yeni kayıtlar tabloya `Active` durumu ile ekleniyor.
- Worker kaydı alıp `Running` durumuna geçiriyor.
- İşlem bittiğinde durum `Sent` oluyor.

Asıl risk, iki worker'ın aynı `Active` kaydı aynı anda alıp iki kez işlem yapmasıdır.

## Örnek veri

| # | Name | Status | Created At |
| --- | --- | --- | --- |
| 1 | John | Active | 2022-12-28 00:00:00 |
| 2 | Ilkay | Active | 2022-12-28 17:47:54 |
| 3 | Erhan | Active | 2022-12-28 17:48:07 |

## Veritabanı bağlantısı

```python
# db_connect.py

from sqlalchemy import create_engine

def get_engine():
    try:
        engine = create_engine('mysql://root:ILK123@localhost/test')
        return engine
    except Exception as e:
        print(f"Error occured while connecting to database: {e}")
        return None
```

## Model tanımı

```python
# models.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Test(Base):
    __tablename__ = 'test'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    status = Column(String)
    created_at = Column(DateTime)
```

## Test kayıtları eklemek

```python
# addrow.py
from sqlalchemy.orm import sessionmaker
import datetime
from models import *
from db_connect import get_engine

engine = get_engine()

if engine:
    Session = sessionmaker(bind=engine)
    session = Session()

    record = Test(name='Beren', status='Active', created_at=datetime.datetime.now())
    session.add(record)
    record = Test(name='Ceren', status='Active', created_at=datetime.datetime.now())
    session.add(record)

    session.commit()
    session.close()
else:
    print("Failed to connect to database")
```

## Kilitli güncelleme

Temel yaklaşım, kaydı şu şekilde almaktır:

```python
record = session.query(models.Test).with_for_update().filter(
    models.Test.id == id,
    models.Test.status == "Active"
).first()
```

Bu sayede transaction açık kaldığı sürece başka bir işlem aynı kaydı aynı şekilde alamaz. Eski HTML sürümündeki örnekte, yapay gecikme ile bu davranış görünür hale getiriliyordu.

```python
# update_with_delay.py
from sqlalchemy.orm import sessionmaker
import time
import models
from db_connect import get_engine

def update_status(engine, id, new_status='Running'):
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        record = session.query(models.Test).with_for_update().filter(
            models.Test.id == id,
            models.Test.status == "Active"
        ).first()

        if record:
            for i in range(20):
                print(i + 1)
                time.sleep(1)

            record.status = new_status
            session.commit()
            print("Record was updated")
    except Exception as exc:
        session.rollback()
        print(exc)
    finally:
        session.close()
```

## Neden önemli?

- Aynı kaydın iki kez işlenmesini engeller
- Dağıtık worker mimarilerinde veri tutarlılığını korur
- Özellikle kuyruk benzeri iş akışlarında güvenilirlik sağlar

## Dikkat edilmesi gerekenler

- Transaction gereksiz yere uzun tutulmamalı
- Kullanılan veritabanının `FOR UPDATE` davranışı kontrol edilmeli
- Timeout ve deadlock senaryoları ayrıca ele alınmalı

## Sonuç

`with_for_update()` tek başına her şeyi çözmez ama aynı kaydı aynı anda işleme problemini önlemek için güçlü ve doğru bir başlangıçtır. Özellikle worker tabanlı sistemlerde, durum güncellemesi ve transaction sınırları birlikte tasarlanmalıdır.