var all_questions = [{
  question_string: "Hasil Penjumlahan dari 10 + 5 adalah",
  choices: {
    correct: "15",
    wrong: ["20", "10", "25"]
  }
}, {
  question_string: "Hasil Pengurangan dari 9 + 4 adalah",
  choices: {
    correct: "5",
    wrong: ["6", "4", "7"]
  }
}, {
  question_string: "Hasil Penjumlahan dari 4 + 3 + 2 adalah",
  choices: {
    correct: "9",
    wrong: ["6", "7", "8"]
  }
}, {
  question_string: 'Hasil Pengurangan dari 8 - 0 - 5 adalah',
  choices: {
    correct: "3",
    wrong: ["2", "4", "5"]
  }
}, {
  question_string: 'Jika Indah mempunyai Rp 2 dan Beni mempunyai Rp 5, berapa jumlah uang mereka ?',
  choices: {
    correct: "Rp 7",
    wrong: ["Rp5", "Rp 4", "Rp 6"]
  }
}, {
  question_string: 'Andi pergi ke toko hewan, disana dia melihat 7 kelinci, 4 kelinci sedang tidur, Berapa yang tidak tidur ?',
  choices: {
    correct: "3",
    wrong: ["4", "5", "6"]
  }  
}, {
  question_string: 'Adik mempunyai 32 kelereng, kakak memberinya 10 kelereng, berapa jumlah kelereng adik seluruhnya ?',
  choices: {
    correct: "42",
    wrong: ["45", "43", "52"]
  }  
}, {
  question_string: 'Bola tenis ……….. dari pada bola basket ',
  choices: {
    correct: "Lebih Ringan",
    wrong: ["Lebih Berat", "Sama Berat", "Tidak ada yang benar"]
  }  
}, {
  question_string: 'Keranjang merah berisi 20 butir telur, keranjang hijau berisi 40 butir telur. Yang lebih berat adalah keranjang ?',
  choices: {
    correct: "Hijau",
    wrong: ["Merah", "Sama Berat", "Tidak ada yang benar"]
  }
}, {
  question_string: 'Ibu Maya membuat 50 kue, diberikan pada susi 10 kue. Berapa sisa kue ibu Maya ? ',
  choices: {
    correct: "40",
    wrong: ["30", "50", "20"]
  }    
}];


var Quiz = function(quiz_name) {
  
  this.quiz_name = quiz_name;
  
  this.questions = [];
}

Quiz.prototype.add_question = function(question) {
  var index_to_add_question = Math.floor(Math.random() * this.questions.length);
  this.questions.splice(index_to_add_question, 0, question);
}
Quiz.prototype.render = function(container) {
  var self = this;
  $('#quiz-results').hide();
  $('#quiz-name').text(this.quiz_name);
  
  var question_container = $('<div>').attr('id', 'question').insertAfter('#quiz-name');
  
  function change_question() {
    self.questions[current_question_index].render(question_container);
    $('#prev-question-button').prop('disabled', current_question_index === 0);
    $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);
    
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  }
  
  var current_question_index = 0;
  change_question();
  
  $('#prev-question-button').click(function() {
    if (current_question_index > 0) {
      current_question_index--;
      change_question();
    }
  });
  
  $('#next-question-button').click(function() {
    if (current_question_index < self.questions.length - 1) {
      current_question_index++;
      change_question();
    }
  });
  
  $('#submit-button').click(function() {
    var score = 0;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) {
        score++;
      }
    }
    
    var percentage = score / self.questions.length;
    var salah = self.questions.length - score;
    console.log(percentage);
    var message;
    if (percentage === 1) {
      message = 'Bagus, Tingkatkan'
    } else if (percentage >= .75) {
      message = 'Lumayan, Terus Belajar.'
    } else if (percentage >= .5) {
      message = 'Belajar lagi ya dek.'
    } else {
      message = 'Belajar Lebih keras lagi.'
    }
    $('#quiz-results-message').text(message);
    $('#quiz-results-score').html('Benar :' + score + '       Salah :' + salah);
    $('#quiz-results').slideDown();
    $('#quiz button').slideUp();
  });
  
  question_container.bind('user-select-change', function() {
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  });
}

var Question = function(question_string, correct_choice, wrong_choices) {
  this.question_string = question_string;
  this.choices = [];
  this.user_choice_index = null; 
  
  this.correct_choice_index = Math.floor(Math.random() * wrong_choices.length + 1);
  var number_of_choices = wrong_choices.length + 1;
  for (var i = 0; i < number_of_choices; i++) {
    if (i === this.correct_choice_index) {
      this.choices[i] = correct_choice;
    } else {
      var wrong_choice_index = Math.floor(Math.random(0, wrong_choices.length));
      this.choices[i] = wrong_choices[wrong_choice_index];
      wrong_choices.splice(wrong_choice_index, 1);
    }
  }
}


Question.prototype.render = function(container) {

  var self = this;
  

  var question_string_h2;
  if (container.children('h2').length === 0) {
    question_string_h2 = $('<h2>').appendTo(container);
  } else {
    question_string_h2 = container.children('h2').first();
  }
  question_string_h2.text(this.question_string);
  
  if (container.children('input[type=radio]').length > 0) {
    container.children('input[type=radio]').each(function() {
      var radio_button_id = $(this).attr('id');
      $(this).remove();
      container.children('label[for=' + radio_button_id + ']').remove();
    });
  }
  for (var i = 0; i < this.choices.length; i++) {
    var choice_radio_button = $('<input>')
      .attr('id', 'choices-' + i)
      .attr('type', 'radio')
      .attr('name', 'choices')
      .attr('value', 'choices-' + i)
      .attr('checked', i === this.user_choice_index)
      .appendTo(container);
  
    var choice_label = $('<label>')
      .text(this.choices[i])
      .attr('for', 'choices-' + i)
      .appendTo(container);
  }
  
 
  $('input[name=choices]').change(function(index) {
    var selected_radio_button_value = $('input[name=choices]:checked').val();
    
    self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));
    
    container.trigger('user-select-change');
  });
}
$(document).ready(function() {
  var quiz = new Quiz('Belajar Berhitung');
  
  for (var i = 0; i < all_questions.length; i++) {
    var question = new Question(all_questions[i].question_string, all_questions[i].choices.correct, all_questions[i].choices.wrong);
    quiz.add_question(question);
  }
  var quiz_container = $('#quiz');
  quiz.render(quiz_container);
});
