# Biblioteca TypeScript para RFID USB

Esta biblioteca TypeScript foi desenvolvida para facilitar a integração com dispositivos RFID USB em aplicações React no lado do cliente.
A necessidade desta lib veio neste projeto: https://github.com/LabsPlus/Eat-Eating-WebApp, um sistema para gerenciamento de restaurantes universitarios, implantado em algumas universidades do sul da Bahia.

## Instalação

Para instalar a biblioteca, você pode usar npm ou yarn:

```bash
npm install rfid-driver
```

## Como Encontrar Vendor ID e Product ID

Para integrar o seu dispositivo RFID USB com esta biblioteca, siga os passos abaixo para obter o Vendor ID e Product ID necessários:

### Windows:

1. Conecte o leitor RFID USB ao seu computador.
2. Abra o "Gerenciador de Dispositivos".
3. Localize o seu dispositivo na lista de dispositivos USB.
4. Clique com o botão direito do mouse no dispositivo e selecione "Propriedades".
5. Na guia "Detalhes", selecione "IDs de hardware" no menu suspenso.
6. Anote o Vendor ID e Product ID exibidos.

### Linux:

1. Conecte o leitor RFID USB ao seu computador.
2. Abra um terminal.
3. Execute o comando `lsusb`.
4. Encontre o seu dispositivo na lista. O output mostrará o Vendor ID e Product ID do dispositivo.
5. Anote o Vendor ID e Product ID exibidos.


## Exemplos de Uso

### Exemplo Básico de Uso

```typescript
import { RfidDriver } from 'rfid-driver';

const vendorId = 0x1234; // Substitua com o ID do fornecedor do seu dispositivo
const productId = 0x5678; // Substitua com o ID do produto do seu dispositivo

const rfid = new RfidDriver(vendorId, productId);

async function readData() {
    try {
        const data = await rfid.readData('FFCA000000');
        console.log('Dados lidos:', data.toString('hex'));
    } catch (error) {
        console.error('Erro ao ler dados:', error);
    } finally {
        rfid.close();
    }
}

readData();
```

## Integração com React

```typescript
import React, { useEffect, useState } from 'react';
import { RfidDriver } from 'rfid-driver';

const vendorId = 0x1234; // Substitua com o ID do fornecedor do seu dispositivo
const productId = 0x5678; // Substitua com o ID do produto do seu dispositivo

const RfidReader: React.FC = () => {
    const [rfid, setRfid] = useState(null);

    useEffect(() => {
        const initRfid = async () => {
            try {
                const driver = new RfidDriver(vendorId, productId);
                await driver.openDevice();
                setRfid(driver);
            } catch (error) {
                console.error('Erro ao inicializar RFID:', error);
            }
        };

        initRfid();

        return () => {
            if (rfid) {
                rfid.close();
            }
        };
    }, []);

    const handleReadData = async () => {
        try {
            if (rfid) {
                const data = await rfid.readData('FFCA000000');
                console.log('Dados lidos:', data.toString('hex'));
            }
        } catch (error) {
            console.error('Erro ao ler dados:', error);
        }
    };

    return (
        <div>
            <button onClick={handleReadData}>Ler Dados RFID</button>
        </div>
    );
};

export default RfidReader;

```

## Exemplos de Dispositivos

A biblioteca suporta uma variedade de dispositivos RFID. Aqui estão alguns exemplos:

- **Dispositivo A**
  - **Vendor ID:** 0x1234
  - **Product ID:** 0x5678

- **Dispositivo B**
  - **Vendor ID:** 0xABCD
  - **Product ID:** 0xEF01

## Contribuição

Contribuições são bem-vindas! Para relatar bugs ou enviar pull requests, por favor, consulte nosso [repositório no GitHub](https://github.com/WesleyUlisses/RFID-Driver/).
