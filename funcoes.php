<?php

try{
    switch($_POST['form']){
        case $_REQUEST['pesquisa']:
            $conexao = new PDO('mysql:host=localhost;dbname=bd_pokemon;','root','');
            $nome = $_POST['nome'];
            $tipo = $_POST['tipo'];
            $imagem = $_POST['imagem'];


            $insert = "INSERT INTO `pokemon`(`imagem`,`nome`, `tipo`) VALUES (:imagem,:nome,:tipo)";

            $conectar = $conexao->prepare($insert);

            $conectar->bindParam(':imagem', $imagem);
            $conectar->bindParam(':nome', $nome);
            $conectar->bindParam(':tipo', $tipo);

            $conectar->execute();
        break;

        case $_REQUEST['mostrar']:
            $conexao = new PDO('mysql:host=localhost;dbname=bd_pokemon;','root','');
            $consulta = "SELECT * FROM pokemon";
            $conectar = $conexao->prepare($consulta);

            $conectar->execute();

            $resultado = array();

            while($linha = $conectar->fetch(PDO::FETCH_ASSOC)){
                $resultado[] = array(
                    "id"=>$linha["id"],
                    "imagem"=>$linha["imagem"],
                    "nome"=>$linha["nome"],
                    "tipo"=>$linha["tipo"]
                );
            }

            die(json_encode($resultado));
        break;

        case $_REQUEST['deletar']:
            $conexao = new PDO('mysql:host=localhost;dbname=bd_pokemon;','root','');
    
            $id = $_POST['label'];
    
            $deletar = "DELETE FROM `pokemon` WHERE $id";
    
            $conectar = $conexao->prepare($deletar);
    
            $conectar->execute();
        break;
    }
}catch(PDOException $error){
    echo "Erro: ". $error;
}
?>