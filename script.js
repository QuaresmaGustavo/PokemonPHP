$(document).ready(() => {
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

                $.ajax({
                    url: 'funcoes.php',
                    method: 'POST',
                    data: { nome: nome, tipo: Nometipo, imagem: img },
                    success: function () {
                        $('#btn').val("mostrar");
                    },
                    error: function () {
                        console.log('Erro ao enviar dados: Erro PHP');
                    }
                })
            }, error: function () {
                alert('Erro ao enviar dados: AJAX API');
            }
        })
    })

    $('#btn_v').on('click',()=>{
        $.ajax({
            url: 'funcoes.php',
            method: 'GET',
            dataType:'json',
            success: function (response) {
    
                for(i=0;i < response.length;i++){
                    var pokemon = `<div class="bloco">
                                        <div class="cabecalho">
                                            <label class="id" value="${response.id}">${i}</label>
                                            <button type="button" id="deletar" value="deletar">X</button>
                                        </div>
                                        
                                        <img class="img" src="${response[i].imagem}">
                                        <div class="informacao">
                                            <label>nome: ${response[i].nome}</label>
                                            <label>tipo: ${response[i].tipo}</label>
                                        </div>
                                    </div>`;
                    $('#body').append(pokemon);
                }
            },
            error: function (error) {
                console.log('Erro ao recuperar dados: Erro PHP ', error);
            }
        })
    });

    $('#deletar').on('click',()=>{
        $.ajax({
            url: 'funcoes.php',
            method: 'POST',
            success: function (response) {
                $('#body').remove(pokemon);
            },
            error: function (error) {
                console.log('Erro ao recuperar dados: Erro PHP ', error);
            }
        })
    });
})