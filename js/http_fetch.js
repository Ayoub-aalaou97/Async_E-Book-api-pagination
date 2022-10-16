//https://gutendex.com/?ref=publicapis.dev  ==> Method

const getBooks = (callBack) =>{
    var request = new XMLHttpRequest();
    
    request.addEventListener('readystatechange', () => {
    
        
        if (request.readyState === 4 && request.status === 200) {
    
            callBack(undefined, request);
        }
        else if (request.readyState === 4) 
        {
            
            callBack("error getting Data", undefined);
        }
    });
        
        request.open("GET","https://gutendex.com/books/");
        request.send();
   
}

getBooks(callBack = (error, data)=>{
    if(error)
    {
        console.log(error);
    }
    else
    {
        setupPagination(data.responseText);
    }
});

function setupPagination(data)
{
    //var allData = data.results;
    
     //var stringData = JSON.stringify(data);
    allData = JSON.parse(data);
    allData = allData.results;
  
    
    var state = {
        "dataList": allData,
        "rowPerPage": 5,
        "page": 1,
        "defaultPgNbr": 5
    }

    function pagination(dataList, rowPerPage, page){
        //get the first and last index to make each page with it own row of data
        var firstOfItemIndex = (page - 1) * rowPerPage;
        var lastOfItemIndex = firstOfItemIndex + rowPerPage;

        // const dataListArray = Object.fromEntries(
        //     Object.entries(dataList).slice(firstOfItemIndex, lastOfItemIndex)
        // )
       
        var divideData = [];
        for (let i = 0; i < dataList.length - 1; i++) {

            if(i>=firstOfItemIndex && i<lastOfItemIndex)
            {
                divideData.push(dataList[i]);
            }
        }
        
        
        
        //get number of pages 
        var pages = Math.ceil(dataList.length / rowPerPage);
        
        return {
            "divideData": divideData,
            "pages": pages
        }
    }
    
    function loadBookList()
    {
        var data = pagination(state.dataList, state.rowPerPage, state.page);
      var bookListWrapper = document.getElementById("book-list-wrapper");
      bookListWrapper.innerHTML="";
        data.divideData.forEach(dataItem => {
            
            var authorsLength = Object.keys(dataItem.authors).length;
            

            if(authorsLength === 0)
            {
                bookListWrapper.innerHTML += ` <div class="col-12 col-md-6 col-lg-3 card-col"><div class="card">
                <img class="card-img-top" src="${dataItem.formats["image/jpeg"]}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${dataItem.title}</h5>
                  <a href=${dataItem.formats["text/html"]} target="_blank" class="btn btn-primary">Read <span class="mdi mdi-book-open-blank-variant"></span></a>
                </div> 
                
              </div></div>`
            }
            else
            {
                bookListWrapper.innerHTML += ` <div class="col-12 col-md-6 col-lg-3 card-col"><div class="card">
                <img class="card-img-top" src="${dataItem.formats["image/jpeg"]}" alt="Card image cap">
                <div class="card-body">
                <h5 class="card-title">${dataItem.title}</h5>
                <p class="card-text">${dataItem.authors[0].name}</p>
                <a href=${dataItem.formats["text/html"]} target="_blank" class="btn btn-primary">Read <span class="mdi mdi-book-open-blank-variant"></span></a>
                </div> 
                
                </div></div>`
            }

        });
      
        console.log(data.divideData);
        
        
        addPaginationButton(data.pages);
    }
    
    function addPaginationButton(pages)
    {
        var paginationBtnList = $("#pagination-btn-list");
        paginationBtnList.html("");

        var maxLeft = (state.page - Math.floor(state.defaultPgNbr / 2))
        var maxRight = (state.page + Math.floor(state.defaultPgNbr / 2))

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = state.defaultPgNbr
        }

        if (maxRight > pages) {
            maxLeft = pages - (state.defaultPgNbr - 1)
            
            if (maxLeft < 1){
                maxLeft = 1
            }
            maxRight = pages
        }
        


        for (let page = maxLeft; page <= maxRight; page++) {
            
            paginationBtnList.append(`<li class="page-item"><a class="page-link page" data-index=${page}>${page}</a></li>`);

        }

        
        if (state.page != 1) {
            paginationBtnList.prepend(`<li class="page-item"><a class="page-link page" data-index="1" id="prevBtn">Previous</a></li>`);
        }

        if (state.page != pages) {
            paginationBtnList.append(`<li class="page-item"><a class="page-link page" data-index=${pages} id="nextBtn">Next</a></li>`);
        }

        $(".page").on('click',function(){
            
            $("#test-container").empty();
        // state.page = Number($(this).text());
            state.page = Number($(this).attr("data-index"));
            
            loadBookList();
        });
        

    }

    loadBookList();

}

//create pagination


