
var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB();

exports.handler = function(event, context) {

  var question = (event.question === undefined ? '' : event.question);
  var answer = (event.answer === undefined ? '' : event.answer);

  console.log("debug:question");
  console.log(question);
  console.log("debug:answer");
  console.log(answer);

  if ( question === '' || answer === '' ) {
    console.log("Missing Parameter");
    context.fail({status:403, message:"Missing Parameter"});
  } else {
    var put_item = {
        TableName: 'MagicalLambda',
        Item: {
          key:  { S: question},
          word: { S: answer}
        }
    };
    dynamodb.putItem(put_item, function(err, data) {
      if (err) {
        console.log("DynamoDB putItem Failed");
        console.log(err);
        context.fail({status:500, message:"DynamoDB putItem Failed"});
      } else {
        var next_question = {
          'TableName': 'MagicalLambda',
          'IndexName': 'word-index',
          'KeyConditions': {
            'word': {
                'ComparisonOperator': 'EQ',
                'AttributeValueList': [{'S': answer}]
            }
          },
          'QueryFilter': {
            'key': {
                'ComparisonOperator': 'NE',
                'AttributeValueList': [{'S': question}]
            }
          }
        };
        dynamodb.query(next_question, function(err, data) {
          if (err) {
            console.log("DynamoDB Query Failed");
            console.log(err);
            context.fail({status:500, message:"DynamoDB Query Failed"});
          } else {
            if ( data.Count === 0 ) {
              console.log("sorry...");
              context.fail({status:404, message:"sorry..."});
            } else {
              console.log("Hits:" & data.toString());
              var index = 0;
              if (data.Count > 1){
                index = Math.floor(Math.random()*data.Count);
              }
              var item = JSON.parse(JSON.stringify(data.Items[index]));
              var ret = {
                question: item['word']['S'],
                answer: item['key']['S']
              };
              console.log(ret);
              context.succeed({status:200, message:"ok", data: ret});
            }
          }
        });
      }
    });
  }
};
