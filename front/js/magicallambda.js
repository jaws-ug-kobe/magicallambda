$(function() {
  questionRequest = function(){
    var client = apigClientFactory.newClient();

    var params = {
    };

    var body = {
    };

    var additionalParams = {
      headers: {
      },
      queryParams: {
      }
    };

    client.questionGet(params, body, additionalParams)
        .then( function(result){
          var banana_sound = $("#banana-sound");
          banana_sound[0].currentTime = 0;
          banana_sound[0].play();

          $("#result-cpu-answer").html("");
          $("#question-target").val(result.data.question)
          return $("#result-get-question").html(result.data.question + "と言えば...");
        })
        .catch(function(result){
          $("#result-cpu-answer").html("負けました。" + $("#text-answer").val() + "と言ったら何ですか？")
          $("#question-target").val($("#text-answer").val());
          $("#result-get-question").html($("#text-answer").val() + "と言えば...");
        });
  }; // questionRequest

  answerRequest = function(){
    var client = apigClientFactory.newClient();

    var params = {
    };

    var body = {
      "question":$.trim($("#question-target").val()),
      "answer":$.trim($("#text-answer").val())
    };

    var additionalParams = {
      headers: {
      },
      queryParams: {
      }
    };

    client.answerPost(params, body, additionalParams)
      .then( function(result){
        cpu = result.data.data;
        $("#result-cpu-answer").html(cpu.question + "と言えば..." + cpu.answer);
        $("#question-target").val(cpu.answer);
        $("#result-get-question").html(cpu.answer + "と言えば...").delay(2000);
        $("#text-answer").val("");
      })
      .catch(function(result){
        $("#result-cpu-answer").html("負けました。" + $("#text-answer").val() + "と言ったら何ですか？")
        $("#question-target").val($("#text-answer").val());
        $("#result-get-question").html($("#text-answer").val() + "と言えば...");
        $("#text-answer").val("");
      });
  }; // answerRequest


  $("#game-start").on("click", function() {
    questionRequest();
  });

  $("#button-post-answer").on("click", function() {
    answerRequest();
  });

});
