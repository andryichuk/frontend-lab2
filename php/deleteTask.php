<?php
    // get data
    $param = json_decode($_POST["param"]);
    $id = $param->id;

    $file = file_get_contents('../data/tasks.json'); 
    $taskList = json_decode($file,TRUE);    
    
    if($taskList[$id] === NULL) {
        exit('id false');
    }
    
    unset($taskList[$id]);   
    file_put_contents('../data/tasks.json', json_encode($taskList)); 
    unset($taskList);                           

    exit("success");
?>