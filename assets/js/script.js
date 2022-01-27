var alphabet_ptbr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var word_list = "";
var matrize_size = 0, error_pos = 0;
var atmt = [], final_lines = [];

// Inicia o modal e preenche o cabeçalho da tabela com o alfabeto.
$(document).ready(function () {
	$('.modal').modal();
	$(".alphabet").append("<th scope='col'>—</th>");
	for (var a = 0; a < 26; a++) {
		$(".alphabet").append("<th scope='col'>" + alphabet_ptbr[a] + "</th>");
	}
});

function clear_automato() {
	final_lines = [];
	word_list = "";
}

$(".limparTabela").click(function () {
	$(".words_at").html("");
	$(".word_chips").html("");
	$(".word_to_insert").val("");
	$(".word_to_find").val("");
	clear_automato();
});

// Verifica os caracteres ao ser digitado
$(".word_to_insert").keyup(function () {
	var word_to_insert = $(".word_to_insert").val();
	check_letters_in(word_to_insert);
});

function check_letters_in(word_to_insert) {
	var valor = word_to_insert.replace(/[^A-z]+/g, '');
	$(".word_to_insert").val(valor.toLowerCase());
}

$(".word_insert").click(function () {
	var PalavraIn = $(".word_to_insert").val().toLowerCase();

	// Usuário clicou em inserir e não digitou a palavra.
	if (PalavraIn == "") {
		$(function () {
			M.toast({ html: 'Digite uma palavra para inserir', classes: 'rounded', classes: 'red' });
		});
	} else {
		// Limpa o campo da palavra a ser inserida
		$(".word_to_insert").val("");
		// Seta cor na primeira linha.
		PaintElement("#1", "#50d456");
		//Seta display: block; na tabela no cabeçalho e corpo, permitindo o scroll
		$('.table_automato thead, .table_automato tbody').css("display", "block");
		AutomatoBuild(PalavraIn, 0);
	}
});

// Remover Palavra
function word_remove(word_remove) {
	$(".words_at").html("");
	var words_array = word_list.split(" ");
	word_list = "";

	// Constroi automato sem a palavra
	for (var i = 0; i < words_array.length; i++) {
		var word = words_array[i].trim();
		if (word_remove != word) {
			AutomatoBuild(word, 1);
		}
		// atualiza tamanho da matriz
		matrize_size += word.length;// tamanho de cada palavra
	}
}

// Procura o token digitado ao clicar em buscar

$(".word_find").click(function () {
	var word = $(".word_to_find").val();
	if (word != "") {
		word_find();
	} else {
		M.toast({ html: 'Digite uma palavra para buscar', classes: 'rounded', classes: 'red' });
	}
});

function clear_automato() {
	final_lines = [];
	word_list = "";
}

function scrolltable(value1, value2, value3) {
	$(".table_automato tbody").scrollTop((value1 - value2) * value3);
}

function whitetable() {
	$(".tr").css("background", "white");
}

function PaintElement(element, color) {
	$(element).css("background", color);
}

function FindWord(word) {
	var status = true;
	var pos_line = 1, pos_column = 0;

	// volta para o topo
	if (word == "" || word == null) {
		whitetable();
		PaintElement("#1", "#50d456");
		scrolltable(0, 2, 52);
	}

	for (var i = 0; i < word.length; i++) {
		// Pega a posição da letra no alfabeto
		pos_column = alphabet_ptbr.indexOf(word[i]) + 1;

		//Seta para branco a cor da tabela
		if (status == true || word.length < 1) {
			whitetable();
		}

		if (word[i] != " ") {
			//Verificar se a palavra está no alfabeto
			if (pos_column != 0 && status == true) {
				// Verifica a linha e a coluna que o token está
				if (atmt[parseInt(pos_line)][parseInt(pos_column)] != "notfound" && status == true) {
					// Novo estado, pega a posição.
					pos_line = atmt[parseInt(pos_line)][parseInt(pos_column)];
					PaintElement("#" + (pos_line), "#50d456");
					scrolltable(pos_line, 2, 52);
				}
				else {
					status = false;
					PaintElement("#" + error_pos, "#f44336");
					scrolltable(error_pos, 2, 52);
				}
			}
			else {
				status = false;
				PaintElement("#" + error_pos, "#f44336");
				scrolltable(error_pos, 1, 52);
			}

		}
		else if (i != word.length - 1) {
			status = false;
			PaintElement("#" + error_pos, "#f44336");
			scrolltable(error_pos, 1, 52);
		}
		else {
			var final_line = false;
			// Verifica se o estado é final, se a linha estiver no array final_lines ela é final.
			for (var j = 0; j < final_lines.length; j++) {
				if (parseInt(final_lines[j]) == parseInt(pos_line)) {
					final_line = true;
				}
			}
			// Caso o status for ok e o estado for final, esta é uma palavra que está na lista.
			if (status && final_line) {
				M.toast({ html: 'A palavra "' + word.trim() + '" foi encontrada!', classes: 'rounded', classes: 'green' });
			}
			else {
				M.toast({ html: 'A palavra "' + word.trim() + '" não foi encontrada!', classes: 'rounded', classes: 'red' });
			}
			$(".word_to_find").val('');
			scrolltable(0, 1, 52);
			whitetable();
			PaintElement("#1", "#50d456");

		}
	}
}

//Acionado ao digitar espaço
$(".word_to_find").keyup(function () {
	var word = $(".word_to_find").val();
	if (word[0] == " ") {
		M.toast({ html: 'Digite uma palavra', classes: 'rounded', classes: 'red' });
		$(".word_to_find").val('');
	} else {
		FindWord(word)
	}
});


//Acionado ao clicar no botão buscar
function word_find() {
	var word = $(".word_to_find").val() + " ";
	FindWord(word)
}

// Parte da construção do automato dinâmico.
function AutomatoBuild(TheWord, Action) {

	// Define a matriz do automato
	atmt = [];
	
	//Pega o tamanho do alfabeto que foi utilizado
	var tamanhoAlfabeto = alphabet_ptbr.length;
	// Por precaução, limpa todos os espaços da palavra, se houver algum
	TheWord = TheWord.trim();
	// Adiciona a palavra na word_list
	word_list = word_list + " " + TheWord;	
	// Zera as linhas finais
	final_lines = [];	
	// Limpa os "chips" do materialize, ou seja, palavras já inseridas 
	$(".words_at").html("");

	// Separa as palavras por espaço
	var TheWordAll = word_list.split(" ");

	// Pega o tamanho da lista de palavras
	var SizeWordList = TheWordAll.length

	// Nesta parte é definido o tamanho da matriz a partir do novo automato.

	for (var i = 0; i < SizeWordList; i++) {
		var TheWordIndividual = TheWordAll[i].trim();
		matrize_size += TheWordIndividual.length;
	}

	//Define o tamanho da matriz com a linha de erro e também define a posição do erro, que é sempre a última linha, então -1.
	matrize_size += 3;
	error_pos += - 1;

	// Inicia o automato com as letras do alfabeto
	var SizeAlphabet = tamanhoAlfabeto + 1;
	for (var i = 0; i < SizeAlphabet + 1; i++) {
		atmt[i] = new Array(SizeAlphabet + 1);
	};	
	atmt[0][0] = "—";
	for (var i = 0; i < tamanhoAlfabeto; i++) {
		var letter = String.fromCharCode(97 + i);
		atmt[0][(i + 1)] = letter;
	};

	//Preenche o restante

	for (var line = 1; line < matrize_size; line++) {

		for (column = 0; column <= tamanhoAlfabeto; column++) {

			/*if (atmt[line] == null) 
			{
				atmt[line] = [];
			} */

			if (!atmt[line]) 
			{
				atmt[line] = [];
			}

			atmt[line][column] = "notfound";
		}
	}

	var  counter_lines = 0, total_lines = 1,last_line = 1, next_line = 1;

	for (var line = 1; line < SizeWordList; line++) 
	{ 
		// Reseta a proxima linha
		next_line = 1;

		// Pega a linha
		var TheWord = TheWordAll[line].trim();
		var TheWordSize = TheWord.length;

		for (var column = 0; column < TheWordSize; column++) 
		{
			// Pega a letra no alfabeto pra colocar na linha			
			var LetterPos = alphabet_ptbr.indexOf(TheWord[column]) + 1;			
			if (atmt[parseInt(next_line)][parseInt(LetterPos)] == 'notfound') 
			{
				// Soma a ultima linha e o total que já foi
				last_line++;
				total_lines++;

				// Caso não achar, armazena a próxima linha a ser lida
				atmt[parseInt(next_line)][parseInt(LetterPos)] = last_line;
			}

			// Letra que foi gravada
			next_line = atmt[parseInt(next_line)][parseInt(LetterPos)];

			var MyLength = TheWord.length - 1;
			if (column == MyLength) 
			{
				//Marca como linha terminal, pois tem palavra finalizando aqui.
				final_lines[counter_lines] = next_line;

				//Soma a linha processada
				counter_lines++;
			}
		}
	}

	// Constroi a tabela
	TabelaBuild(total_lines, final_lines, atmt);

	// 0 = insert | 1  = delete
	if (Action == 0) { 
		AppendWord(TheWord);
	}
	
}

function AppendWord(TheWord) {
	$(".word_chips").append("<div class='chip m2'>" + TheWord + "<i class='close material-icons' onclick=\"word_remove('" + TheWord + "', this)\">close</i></div>");
}

function TabelaBuild(totalLinha, final_lines, atmt) {

	var TotalSize =  totalLinha + 2;
	matrize_size = TotalSize;
	var ErrorPos = matrize_size - 1;
	error_pos = ErrorPos;

	for (var line = 1; line < matrize_size; line++) {
		$(".words_at").append("<tr class='tr' id=" + line + " ></tr>");
		if (line == 1) {
			$(".words_at #" + line).append("<td class='my_td'>→q" + line + "</td>");
		} else {
			var final_line = false;
			for (var end_line = 0; end_line < final_lines.length; end_line++) {
				if (parseInt(final_lines[end_line]) == parseInt(line)) {
					final_line = true;
				}
			}
			if (final_line) {
				$(".words_at #" + line).append("<td>*q" + line + "</td>");
			} else {
				$(".words_at #" + line).append("<td>q" + line + "</td>");
			}
		}
		for (var column = 1; column <= 26; column++) {
			if (atmt[line][column] == "notfound") {
				// se for linha sem nada, preenche com X
				if (line == error_pos) {
					$("#" + line).append("<td class='my_td'>X</td>");
				} else {
					$("#" + line).append("<td class='my_td'></td>");
				}
			} else {
				$("#" + line).append("<td class='my_td'>q" + atmt[line][column] + "</td>");
			}
		}
	}

	PaintElement("#1", "#50d456");


	/////////////////////////// [AJUSTE DA TABELA CONFORME TBODY] /////////////////////////////

	var $table_automato = $('table.table_automato');
	var $cellstbody = $table_automato.find('tbody tr:first').children();
	var width;
	$(window).resize(function () {
		width = $cellstbody.map(function () {
			return $(this).width();
		}).get();

		$table_automato.find('thead tr').children().each(function (x, y) {
			$(y).width(width[x]);
		});
	}).resize();

	//////////////////////////////////////////////////////////////////////////////////////////////

}
