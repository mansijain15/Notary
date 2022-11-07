function loadBook(filename,displayName){
    let currentBook=" ";
    let url = "books2/" + filename;
    // reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value="";
    // create a server request
    var xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            //0,1,2,3,4
            currentBook = xhr.responseText;

              getDocStats(currentBook);

             currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g,'<br>');
            document.getElementById("fileContent").innerHTML = currentBook;
            // remove line breaks and carraige returns and replace with a <br>
           
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        }
    };
}
//get the stats for the book
function getDocStats(fileContent) {
    var docLength = document.getElementById("doclength");
    var wordCount = document.getElementById("wordcount");
    var charCount = document.getElementById("charcount");

    let text = fileContent.toLowerCase();
    // regular expression looked for spaces and the character between two spaces is consisdered as a word
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};
     
    var uncommonWords = [];
    // filter out the uncommon words
    uncommonWords=filterStopWords(wordArray);


        // count every word in the wordarray
        for(let word in uncommonWords){
            let wordValue = uncommonWords[word];
            if (wordDictionary[wordValue] > 0){
                wordDictionary[wordValue]+=1;
            }
            else{
                wordDictionary[wordValue] = 1;
            }
        }
        let wordList = sortProperties(wordDictionary);
        // return the top 5 words
        var top5Words = wordList.slice(0, 6);
        var least5Words = wordList.slice(-6, wordList.length);
        // write them to the page 
        ULTemplate(top5Words, document.getElementById("mostUsed"));
        ULTemplate(least5Words, document.getElementById("leastUsed"));

        docLength.innerText = "Document length: " + text.length;
        wordCount.innerText = "word Count: " + wordArray.length;
    }
    function ULTemplate(items, element) {
        let rowTemplate = document.getElementById('template-ul-items');
        let templateHTML = rowTemplate.innerHTML;
        let resultsHTML = "";
        for (i = 0; i < items.length - 1; i++) {
            resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
        }
        element.innerHTML = resultsHTML;
    }

    function sortProperties(obj) {
    // first convert an object to an array
    let rtnArray = Object.entries(obj);
    // sort the array
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;

}
// filter out stop words 
function filterStopWords(wordArray){
    var commonWords = getStopwords();
    var commonObj = {};
    var uncommonArr =[];
    for(i=0;i<commonWords.length;i++){
        commonObj[commonWords[i].trim()] = true;
    }
    for(i=0;i<wordArray.length;i++){
        word = wordArray[i].trim().toLowerCase();
        if(!commonObj[word]){
            uncommonArr.push(word);
        }
    }
    return uncommonArr;
}
// a list of stop words we dont want to use in stats(mostused or leastused)
function getStopwords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];

}
// highlight the words in the search

function performMark() {
    // read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");
    var newContent = "";
    // find all of the currently marked items 
    let spans = document.querySelectorAll('mark');
//<mark> harry </mark>
    //Harry
    for(var i = 0;i<spans.length;i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }
    // gi=global case insensitive
    var re = new RegExp(keyword,"gi");
    var replaceText = "<mark id = 'markme'> $&</mark>";
    var bookContent = display.innerHTML;
    //add the mark tot he book content
    newContent = bookContent.replace(re,replaceText);
    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found" + count + "matches";
    if(count > 0){
        var element = document.getElementById("markme");
        // scroll to first item it found
        element.scrollIntoView; 
    }
}
