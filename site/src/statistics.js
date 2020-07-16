function renderStatistics() {
  
  if(api.db === undefined) {
    console.log("waiting on DB connection...");
    setTimeout(renderStatistics, 1000);
    return 
  }

  function renderAuthors(docs) {
    var uniqueValues = docs[0]["uniqueValues"];
    console.log(uniqueValues);

    function compare(a, b) {
      if (a.length < b.length) {
        return 1;
      }
      if (a.length > b.length) {
        return -1;
      }
      return 0;
    }
    uniqueValues.sort(compare);
    
    var rendered = "";

    function renderItem(list) {
      return `${list
            .map(
              item =>
                `<button type="button" class="btn btn-success view-author" data-encoded-url="${lib.mergeQuery({"authors": item})}">
                   <i class="fas fa-search-plus" title="View Incidents from ${item}"></i>${item}
                 </button>
                 <button type="button" class="btn btn-danger delete-author" data-encoded-url="${lib.mergeQuery({"authors": item})}">
                   <i class="fas fa-search-plus" title="View Incidents from ${item}"></i>${item}
                  </button>`
            )
            .join('')}`
      return
    }
    rendered += `${uniqueValues
      .map(
        item =>
          `
            <div class="card_detail card_pad">
              <div class="card">
                <div class="card-body">
                  <article>
                    ${renderItem(item)}
                  </article>
                </div>
              </div>
            </div>`
      )
      .join('')}`;
    
      $(".author_list").html(rendered);
      $(".view-author").click(function(evt){
        var url = "index.html" + $(evt.target).data("encoded-url");
        window.open(url, "Author Reports", []);
      });
      $(".delete-author").click(function(evt){
        var but = $(evt.target).prop('nodeName') == "BUTTON" ? $(evt.target) : $(evt.target).parent();
        var author = lib.parseQuery(but.data("encoded-url")).authors;
        api.pullAuthor(author)
      });
  }
  api.getAuthors(renderAuthors);
}

$( document ).ready(renderStatistics);