$(document).ready(() => {

    //CONSUMIR API
    $('#btn').on('click', () => {
        var pesq = $("#pesquisa").val();

        var link = 'https://pokeapi.co/api/v2/pokemon/' + pesq;
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

                        $('#mensagem').remove();

                        const mensagem = `<span id="mensagem">${response}</span>`;

                        $('#container').append(mensagem);

                        GerarPokemon();
                        
                    },
                    error: function (error) {

                        alert('Erro ao enviar dados para o banco de dados ' + error);

                    }
                })
            }, error: function () {

                console.log('Erro durante consumo da API');

            }
        });
    });

    //BOTÃO PARA GERAR POKEMON DO BD
    $('#btn_v').on('click', ()=>{
        GerarPokemon();
    })

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

                console.log('Erro ao gerar Pokemon do Banco de dados ' + error);

            }
        });
    };

    //DELETAR
    $(document).on('click', '.btn_deletar', function () {

        var id = $(this).closest('.bloco').find('.id input').val();

        console.log("id " + id);

        $.ajax({
            url: 'funcoes.php?funcao=deletar&id=' + id,
            method: 'POST',
            success: function (response) {

                $('#mensagem').remove();

                $(this).closest('.bloco').remove();

                const mensagem = `<span id="mensagem">${response}</span>`;

                $('#container').append(mensagem);

                GerarPokemon();
            },
            error: function (error) {

                console.log('Erro ao deletar pokemon ' + error);

            }
        });
    });
});