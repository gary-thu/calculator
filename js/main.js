$(document).ready(function() {
    var $mainOutput = $('#output');
    var $subOutput = $('#output2');
    var $op = $('#operator');
    var $num2 = $('#num2');
    var $num1 = $('#num1');
    var $temp = $('#temp');
    var conputeNumber = true;
    var isPlay = false;
    var clearData = function() {
        $num1.val('');
        $op.val('');
        $num2.val('');
        $temp.val('');
    };

    var clearOutput = function() {
        $mainOutput.html('');
        $subOutput.html('');
    };

    var digitError = function() {
        $mainOutput.html('0');
        $subOutput.html('Reach Digit Limit');
        $temp.val(0);
    };

    var toggle = function(sex){
      if(sex){    //男女判断
        $btns[2].disabled=true;
        $btns[3].disabled=false;
      }else{
        $btns[2].disabled=false;
        $btns[3].disabled=true;
      }
    };

    var count = function(){
      var value = $mainOutput.html().trim();
      if(value){
        // var sex = $sex[0].checked?1:0;
        var sex = 1;
        // var type = $type[0].checked?'default':'chain';
        var type = 'default';
        // var reverse = !$reverse[0].checked;
        var reverse = false;
        var result = relationship({text:value,sex:sex,reverse:reverse,type:type});
        $mainOutput.html('');
        if(result.length){
          window.localStorage[window.localStorage.length] = result.join('\n');
          $subOutput.html(result.join('\n'));
        }else{
          window.localStorage[window.localStorage.length] = result.join('\n');
          $subOutput.html('性别有误，请检查你的输入！');
        }
      }else{
        $subOutput.html('');
      }
    }

    $('.nums').click(function() {
      if (!conputeNumber) {
        $mainOutput.html('')
      }
        conputeNumber = true;
        if (('+-*/').indexOf($mainOutput.html()) != -1) {
            $mainOutput.html('');
        }
        // avoid multiple dot
        if ($(this).val() == '.' && ($mainOutput.html()).indexOf('.') != -1) return ;
        if ($mainOutput.html() == '0' || $subOutput.html() == 'Reach Digit Limit') {
           clearOutput()
           //subOutput.html('');
        }

        if ($temp.val() !== '') {
            clearOutput()
            clearData();
        }

        $mainOutput.append($(this).val());
        $subOutput.append($(this).val());

        if ($mainOutput.html().length > 12) {
            digitError();
        }
    });

    $('#clearButton').click(function() {
        $mainOutput.html('0');
        $subOutput.html('');
        clearData();
    });

    $('#deleteButton').click(function() {
        if ($mainOutput.html() != '0') {
            $mainOutput.html($mainOutput.html().substring(0, $mainOutput.html().length-1));
            $subOutput.html($subOutput.html().substring(0, $subOutput.html().length-1));
            if ($mainOutput.html() == '') {
                $mainOutput.html('0');
            }
        }
    });

    $('.btn-operate').click(function() {
    var newOperator = $(this).val();
    if ($num1.val() !== '' &&  ('+-*/').indexOf($num1.val()) == -1 && $op.val() !== '') {
          $num2.val($mainOutput.html());
          if (('+-*/').indexOf($num2.val()) != -1) return ;
          var number1 = parseFloat($num1.val());
          var operator = $op.val();
          var number2 = parseFloat($num2.val());
          var result;
          if (operator == '+') {
              result = number1 + number2;
          } else if (operator == '-') {
              result = number1 - number2;
          } else if (operator == '*') {
              result = number1 * number2;
          } else if (operator == '/') {
              result = parseFloat(number1 / number2);
          }

          if (result.toString().length > 12) {
              digitError();
          } else {
              $mainOutput.html(newOperator);
              $subOutput.html(result + newOperator);
              $num1.val(result);
              $op.val(newOperator);
          }
    } else {
        $num1.val($mainOutput.html());
        $op.val(newOperator);
        $mainOutput.html(newOperator);
        $subOutput.append(newOperator);
    }
    });

    $('.btn-family').click(function() {
      if (conputeNumber) {
        $mainOutput.html('')
      }
      conputeNumber = false;
      console.log($mainOutput.html());
      var value = $mainOutput.html().trim();
      var name = this.getAttribute('data-value');
      if(value){
        $mainOutput.html(value+'的'+name);
      }else{
        $mainOutput.html(name);
      }
      // toggle('爸爸,老公,儿子,哥哥,弟弟'.indexOf(name)>-1);
    });



    $('#resultButton').click(function() {
      if (!conputeNumber) {
        count();
        return;
      }
       if ($mainOutput.html() === '' || ('+-*/').indexOf($mainOutput.html()) != -1) return ;
        $num2.val($mainOutput.html());
        var number1 = parseFloat($num1.val());
        var operator = $op.val();
        var number2 = parseFloat($num2.val());
        var result;

        if (operator == '+') {
            result = number1 + number2;
        } else if (operator == '-') {
            result = number1 - number2;
        } else if (operator == '*') {
            result = number1 * number2;
        } else if (operator == '/') {
            result = parseFloat(number1 / number2);
        }

        if (result.toString().length > 12) {
            digitError();
        } else {
            window.localStorage[window.localStorage.length] = result;
            $mainOutput.html(result);
            $subOutput.html(result);
            clearData();
        }
    });

    $('.btn-reset').click(function() {
      if (window.localStorage.length - 2 >= 0) {
        $mainOutput.html(window.localStorage[window.localStorage.length - 2]);
        $subOutput.html(window.localStorage[window.localStorage.length - 2]);
        window.localStorage.removeItem(window.localStorage.length - 1);
      }
    });

    $('.btn-play').click(function() {
      if (!isPlay) {
        $('.draw-screen').css('display','none');
        $('#play').css('display', '');
        let ctx = document.getElementById("play").getContext("2d");
        let snakeGame = new SnakeGame(ctx);
        document.onkeydown = snakeGame.onkeydown.bind(snakeGame);        
        snakeGame.run();
        isPlay = true;
      }
      else {
        isPlay = false;
        $('#play').css('display', 'none');
        $('.draw-screen').css('display','');
      }
    });

    window.onload = function() {  
      
        // window.localStorage.clear(); //清除所有的变量和值    

    }
});
