const  express = require('express');
const router  = express.Router();
const getAuthSheets = require('../models/credentials');
 
router.get('/', (request, response ) =>{
    response.status(200).send(`O router tá funcionado !`);
});

router.get("/vendedores", async (request, response) => {
  try {
    
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    if (!spreadsheetId) {
      return response.status(500).json({
        message: 'Spreadsheet ID não configurado'
      });
    }
    // Busca dados da planilha
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Vendedor!A2:Z1001",
    });

    const rows = getRows?.data?.values;

    if (!rows || rows.length === 0) {
      return response.status(404).json({
        message: 'Dados não encontrados ou planilha vazia'
      });
    }

    // Transformação dos dados
    const vendedores = rows
      .filter(row => row[0] && row[1])  
      .map(([id, nome_vendedor]) => ({
        id,
        nome_vendedor
      }));

    if (vendedores.length === 0) {
      return response.status(404).json({
        message: 'Nenhum vendedor válido encontrado'
      });
    }

    // Resposta final
    return response.status(200).json(vendedores);

  } catch (error) {
    console.error('Erro ao buscar vendedores:', {
      message: error.message,
      stack: error.stack
    });

    return response.status(500).json({
      error: 'Erro interno no servidor',
      message: 'Falha ao buscar vendedores no Google Sheets'
    });
  }
});

router.get("/condominios", async (request, response) => {
  try {
    
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    if (!spreadsheetId) {
      return response.status(500).json({
        message: 'Spreadsheet ID não configurado'
      });
    }
    // Busca dados da planilha
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Condominio!A2:Z1001",
    });

    const rows = getRows?.data?.values;

    if (!rows || rows.length === 0) {
      return response.status(404).json({
        message: 'Dados não encontrados ou planilha vazia'
      });
    }

    // Transformação dos dados
    const condominos = rows
      .filter(row => row[0] && row[1])  
      .map(([id, nome_condomino,id_cidade, cidade, id_uf, uf, sigla, endereco, numero, cep, bairro]) => ({
        id,
        nome_condomino,
        id_cidade,
        cidade,
        id_uf,
        uf,
        sigla,
        endereco,
        numero,
        cep,
        bairro
      }));

    if (condominos.length === 0) {
      return response.status(404).json({
        message: 'Nenhum condomínios válido encontrado'
      });
    }

    // Resposta final
    return response.status(200).json(condominos);

  } catch (error) {
    console.error('Erro ao buscar condominios:', {
      message: error.message,
      stack: error.stack
    });

    return response.status(500).json({
      error: 'Erro interno no servidor',
      message: 'Falha ao buscar condominios no Google Sheets'
    });
  }
});

router.get("/vendedor/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        message: 'ID do vendedor é obrigatório'
      });
    }

  
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    if (!spreadsheetId) {
      return response.status(500).json({
        message: 'Spreadsheet ID não configurado'
      });
    }

    //  Buscar dados da planilha
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Vendedor!A2:Z1001",
    });

    const rows = getRows?.data?.values;

    if (!rows || rows.length === 0) {
      return response.status(404).json({
        message: 'Planilha vazia ou dados não encontrados'
      });
    }

    //  Procurar vendedor pelo ID
    const vendedorEncontrado = rows.find(row => String(row[0]) === String(id));

    if (!vendedorEncontrado) {
      return response.status(404).json({
        message: `Vendedor com ID ${id} não encontrado`
      });
    }

    //  Montar resposta
    const [vendedorId, nome_vendedor] = vendedorEncontrado;

    return response.status(200).json({
      id: vendedorId,
      nome_vendedor
    });

  } catch (error) {
    console.error('Erro ao buscar vendedor por ID:', {
      message: error.message,
      stack: error.stack
    });

    return response.status(500).json({
      error: 'Erro interno no servidor',
      message: 'Falha ao buscar vendedor no Google Sheets'
    });
  }
});

router.get("/condominio/:id", async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        message: 'ID do condominio é obrigatório'
      });
    }

  
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    if (!spreadsheetId) {
      return response.status(500).json({
        message: 'Spreadsheet ID não configurado'
      });
    }

    //  Buscar dados da planilha
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Condominio!A2:Z1001",
    });

    const rows = getRows?.data?.values;

    if (!rows || rows.length === 0) {
      return response.status(404).json({
        message: 'Planilha vazia ou dados não encontrados'
      });
    }

    //  Procurar vendedor pelo ID
    const condominoEncontrado = rows.find(row => String(row[0]) === String(id));

    if (!condominoEncontrado) {
      return response.status(404).json({
        message: `Condomínio com ID ${id} não encontrado`
      });
    }

    //  Montar resposta
    const [condominoId, nome_condomino,id_cidade, cidade, id_uf, uf, sigla, endereco, numero, cep, bairro] = condominoEncontrado;

    return response.status(200).json({
      id: condominoId,
      nome_condomino,
      id_cidade,
      cidade,
      id_uf,
      uf,
      sigla,
      endereco,
      numero,
      cep,
      bairro
    });

  } catch (error) {
    console.error('Erro ao buscar condomínio por ID:', {
      message: error.message,
      stack: error.stack
    });

    return response.status(500).json({
      error: 'Erro interno no servidor',
      message: 'Falha ao buscar condomínio no Google Sheets'
    });
  }
});

module.exports = router;
