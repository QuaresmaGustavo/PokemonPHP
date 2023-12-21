<?php

try{
    $conexao = new PDO('mysql:host=localhost;dbname=bd_pokemon;','root','');

    $funcao = $_GET['funcao'];

    switch($funcao){
        case 'inserir':
            
            $nome = $_POST['nome'];
            $tipo = $_POST['tipo'];
            $imagem = $_POST['imagem'];

            $verificar = true;

            $consulta = "SELECT * FROM pokemon";
            $conectar = $conexao->prepare($consulta);

            $conectar->execute();

            while($linha = $conectar->fetch(PDO::FETCH_ASSOC)){
                if($nome == $linha["nome"]){
                    $verificar = false;
                    break;
                }
            }

            if($verificar){
                $insert = "INSERT INTO `pokemon`(`imagem`,`nome`, `tipo`) VALUES (:imagem,:nome,:tipo)";

                $conectar = $conexao->prepare($insert);

                $conectar->bindParam(':imagem', $imagem);
                $conectar->bindParam(':nome', $nome);
                $conectar->bindParam(':tipo', $tipo);

                $conectar->execute();
                echo "Pokemon registrado no banco de dados!!";
            }else{
                echo "Pokemon ja registrado no banco de dados!!";
            }
        break;

        case 'mostrar':
            header('Access-Control-Allow-Origin:*'); 
            header('Content-Type: application/json');

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

        case 'deletar':
    
            $id = $_GET['id'];
    
            $deletar = "DELETE FROM `pokemon` WHERE id = $id";
            $conectar = $conexao->prepare($deletar);
            $conectar->execute();

            echo "Pokemon removido do banco de dados!!";
            
        break;
    }
}catch(PDOException $error){
    echo "Erro: ". $error;
}
?>