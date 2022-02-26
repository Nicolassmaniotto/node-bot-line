const axios =require('axios');
const saveLine = require('./save_line')
// var getMarcas = 'https://veiculos.fipe.org.br/api/veiculos//ConsultarMarcas';


var url = "https://veiculos.fipe.org.br/"
var urlGetMarcas = 'api/veiculos//ConsultarMarcas';

var urlGetMarcas = 'https://veiculos.fipe.org.br/api/veiculos//ConsultarMarcas';
var $e ='?codigoTabelaReferencia=281&codigoTipoVeiculo=1';

var getModelos = 'api/veiculos//ConsultarModelos';
var getAnoModelo = 'api/veiculos//ConsultarAnoModelo';
var getModelosAno = 'api/veiculos//ConsultarModelosAtravesDoAno';

var getTudo = 'api/veiculos//ConsultarValorComTodosParametros';
var $retorno = []; 
axios.post(urlGetMarcas+$e).then(async (res)=>{
    for(key in res.data){
        var $Marca = res.data[key].Value;
        var marca =  res.data[key].Label;

        $retorno[key] = {};
        $retorno[key].marca = marca;
        $retorno[key].veiculos = [];

        var $param = `?codigoTipoVeiculo=1&codigoTabelaReferencia=281&codigoModelo=&codigoMarca=${$Marca}&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=`;
        // pega os modelos
      let espera = await axios.post(url+getModelos+$param).then(async (res)=>{
            
            for(key2 in res.data ){
                $ArrayModelo = res.data[key2];
                for(key3 in res.data[key2]){
                    $Modelo = `${res.data[key2][key3].Value}`;
                    if($Modelo.match(/-/)){
                        continue;
                    }
                    var $param = `?codigoTipoVeiculo=1&codigoTabelaReferencia=281&codigoModelo=${$Modelo}&codigoMarca=${$Marca}&ano=&codigoTipoCombustivel=&anoModelo=&modeloCodigoExterno=`;
                    var espera = await axios.post(url+getAnoModelo+$param).then(async (res)=>{
                        for(key3 in res.data ){
                            var $Ano= res.data[key3].Value;
                            var $AnoM = $Ano.split('-');
                            var $param = `?codigoTipoVeiculo=1&codigoTabelaReferencia=281&codigoModelo=${$Modelo}&codigoMarca=${$Marca}&ano=${$Ano}&codigoTipoCombustivel=${$AnoM[1]}&anoModelo=${$AnoM[0]}&modeloCodigoExterno=`;

                            let espera = await axios.post(url+getModelosAno+$param).then(async (res)=>{
                                var $param = `?codigoTabelaReferencia=281&codigoMarca=${$Marca}&codigoModelo=${$Modelo}&codigoTipoVeiculo=1&anoModelo=${$AnoM[0]}&codigoTipoCombustivel=${$AnoM[1]}&tipoVeiculo=carro&modeloCodigoExterno=&tipoConsulta=tradicional`;
                                let espera = await axios.post(url+getTudo+$param).then(async (res)=>{
                                    // console.log(res.data)
                                    $retorno[key].veiculos.push( {
                                        modelo: res.data.Modelo,
                                        fipe: res.data.CodigoFipe,
                                        ano: res.data.AnoModelo,
                                        valor: res.data.Valor
                                    })
                                    ;
                                }).catch((err)=>{

                                })
                            })
                            .catch((err)=>{
                            })
                        }
                    }).catch((err)=>{
                        console.log('getAno')
                    })
                }
                
            }
        }).catch((err)=>{
            console.log(err)
        })
        // console.log($retorno[key])
        saveLine($retorno[key])
    }
})