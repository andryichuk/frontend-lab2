<?php
    class Task {
        public $text;
        public $date;

        function __construct($task_text, $task_date) {
            $this->text = $task_text;
            $this->date = $task_date;
        }

        function validation() {
            $MIN_TEXT_LEN = 3;
            $MAX_TEXT_LEN = 100;
    
            $errors = [];
    
            if(strlen($this->text) < $MIN_TEXT_LEN) {
                $errors[] = "text low len";
            }
            else if(strlen($this->text) > $MAX_TEXT_LEN) {
                $errors[] = "text large len";
            }
    
            return $errors;
        }
    }

    // get data    
    $param = json_decode($_POST["param"]);
    //create task
    $task = new Task($param->text, $param->date);

    //validation data
    $errors = $task->validation();
    if (!empty($errors)) { exit(array_shift ($errors)); }
       
    
    //add task
    $file = file_get_contents('../data/tasks.json'); 
    $taskList = json_decode($file, TRUE);        
    unset($file);   
    
    $taskList[] = $task;             
    file_put_contents('../data/tasks.json',json_encode($taskList));  
    unset($taskList);     

    exit("success");
?>