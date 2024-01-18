$(document).ready(() => {

    //FUNÇÃO GERAR POKEMON QUANDO BD ESTIVER VAZIO
    function gerarAleatorio(){
        var num = Math.floor(Math.random(0,1302)*100);
        $.ajax({
            url: 'funcoes.php?funcao=verificar',
            method: 'POST',
            success: function (dados) {
                if(dados == 0){
                    var url = 'https://pokeapi.co/api/v2/pokemon/'+ num;
                    inserirPokemon(url);
                }
            }, error: function (error) {
    
                alert('Erro ao gerar pokemon'+ error);

            }
        });
    }


    //FUNÇÃO PARA INSERIR POKEMON
    function inserirPokemon(link){
        $.ajax({
            url: link,
            method: 'GET',
            dataType: 'json',
            success: function (dados) {

                var img = dados.sprites.other["official-artwork"].front_default;
                var nome = dados.name;
                var Nometipo = dados.types[0].type.name;

                //SALVAR POKEMON NO BD
                $.ajax({
                    url: 'funcoes.php?funcao=inserir',
                    method: 'POST',
                    data: { nome: nome, tipo: Nometipo, imagem: img, },
                    success: function (response) {

                        const mensagem = `<span id="mensagem">${response}</span>`;

                        $('#container').append(mensagem);

                        GerarPokemon();

                        removerMensagem();
                        
                    },
                    error: function (error) {

                        alert('Erro ao enviar dados para o banco de dados ' + error);

                    }
                })
            }, error: function () {

                alert('Erro durante consumo da API');

            }
        });
    }

    //FUNÇÃO PARA GERAR POKEMON DO BD
    function GerarPokemon() {
        $('.bloco').remove();
        $.ajax({
            url: 'funcoes.php?funcao=mostrar',
            method: 'GET',
            dataType: 'json',
            success: function (response) {

                for (i = 0; i < response.length; i++) {

                    var pokemon = `<div class="bloco">
                                                <div class="cabecalho">
                                                    <span class="id">${i + 1}<input type="hidden" value="${response[i].id}"/></span>
                                                    <button type="button" class="btn_deletar">X</button>
                                                </div>
                                                
                                                <img class="img" src="${response[i].imagem}">
                                                <div class="informacao">
                                                    <span>Nome: ${response[i].nome}</span>
                                                    <span>tipo: ${response[i].tipo}</span>
                                                </div>
                                            </div>`;
                    $('#body').append(pokemon);

                }
            },
            error: function (error) {

                alert('Erro ao gerar Pokemon do Banco de dados ' + error);

            }
        });
    };

    //FUNÇÃO PARA DELETAR
    function Deletar(link){
        $.ajax({
            url: link,
            method: 'POST',
            success: function (response) {

                $(this).closest('.bloco').remove();

                const mensagem = `<span id="mensagem">${response}</span>`;

                $('#container').append(mensagem);

                GerarPokemon();

                removerMensagem();
            },
            error: function (error) {

                alert('Erro ao deletar pokemon ' + error);

            }
        });
    }

    //REMOVER MENSAGEM
    function removerMensagem(){
        setTimeout(() => {
            $('#mensagem').remove();
        }, 3000);
    }

    //GERAR POKEMON ALEATORIAMENTE
    gerarAleatorio();

    //PESQUISAR POKEMON
    $('#btn').on('click', () => {
        let pesq = $("#pesquisa").val().toLowerCase();

        var url = 'https://pokeapi.co/api/v2/pokemon/' + pesq;
        inserirPokemon(url);
    });

    //GERAR POKEMON DO BD
    var contador = 0;
    
    $('#btn_v').on('click', ()=>{
        contador++;
        contador%2 != 0 ? GerarPokemon() : $('.bloco').remove();
    })

    //DELETAR
    $(document).on('click', '.btn_deletar', function () {

        var id = $(this).closest('.bloco').find('.id input').val();

        var url = 'funcoes.php?funcao=deletar&id=' + id;

        Deletar(url);
    });
});