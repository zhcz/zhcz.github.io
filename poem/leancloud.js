
src="https://cdn.jsdelivr.net/npm/leancloud-storage/dist/av-min.js"
function initLeanCloud() {
  const appId = "ynMAn7XOvvxivG61hKnibx0P-gzGzoHsz";
  const appKey = "bJozAX2UEPCNqmriHhTiceIc";
  const serverURL = "https://api.lintiebao.cn";
  AV.init({ appId, appKey, serverURL });
}
 
function requestData(currentPage,pageSize,keyword,callback) {
    const first = new AV.Query("guwen");
    first.contains("writer", keyword);
    const second = new AV.Query("guwen");
    second.contains("content", keyword);
    const third = new AV.Query("guwen");
    third.contains("title", keyword);
    const query = AV.Query.or(first,second,third);
    query.limit(pageSize);
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      // 处理查询结果
        var poemList = document.getElementById('poem-list');
      
        results.forEach(function(object) {
          // 将数据展示在 HTML 页面上
          var contentData = object.get('content');
          var titleData = object.get('title');
          var writerData = object.get('writer');
          var dynastyData = object.get('dynasty');
          var remarkData = object.get('remark');
          var translationData = object.get('translation');
          var shangxiData = object.get('shangxi');
          

          var card = document.createElement('div');
          card.classList.add('poem-card');

          var title = document.createElement('h5');
          title.classList.add('poem-title');
          title.textContent = titleData;

          var author = document.createElement('div');
          author.classList.add('poem-author');
          author.textContent = dynastyData + ' · ' + writerData;

          var content = document.createElement('div');
          content.classList.add('poem-content');
          content.textContent = contentData;

          card.appendChild(title);
          card.appendChild(author);
          card.appendChild(content);
          poemList.appendChild(card);

          // 为诗词卡片添加点击事件
          card.addEventListener('click', function() {
          // 在这里处理点击事件，例如跳转到诗词的详情页
          // window.location.href = 'poem-details.html?title=' + encodeURIComponent(titleData);

            localStorage.setItem('selectedPoemTitle', titleData);
            localStorage.setItem('selectedPoemAuthor', writerData);
            localStorage.setItem('selectedPoemContent', contentData);
            localStorage.setItem('selectedPoemRemark', remarkData);
            localStorage.setItem('selectedPoemTranslation', translationData);
            localStorage.setItem('selectedPoemShangxi', shangxiData);
            localStorage.setItem('selectedPoemDynasty', dynastyData);
            

            // 跳转到详情页
            window.location.href = 'poem-details.html';
        });
        
      });
      callback();
    }).catch(function(error) {
      // 处理错误
      console.error('Error while fetching data:', error);
      callback();
    });
  }
  function clean() {
    var dataContainer = document.getElementById('poem-list');
// 清空容器
    dataContainer.innerHTML = '';
  }

  function requestFamousSentences(currentPage,pageSize,keyword,callback) {

    const first = new AV.Query("sentence");
    first.contains("from", keyword);
    const second = new AV.Query("sentence");
    second.contains("name", keyword);
    const query = AV.Query.or(first,second);
    query.limit(pageSize);
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      // 处理查询结果
        var poemList = document.getElementById('poem-list');
      
        results.forEach(function(object) {
          // 将数据展示在 HTML 页面上
          var fromData = object.get('from');
          var nameData = object.get('name');

          console.log(fromData, nameData);

          var card = document.createElement('div');
          card.classList.add('poem-card');

          var title = document.createElement('h5');
          title.classList.add('poem-title');
          title.textContent = nameData;

          var author = document.createElement('div');
          author.classList.add('poem-author');
          author.textContent = fromData;

          card.appendChild(title);
          card.appendChild(author);
          poemList.appendChild(card);
          // 为诗词卡片添加点击事件
          card.addEventListener('click', function() {

          });
      });
      callback();
    }).catch(function(error) {
      // 处理错误
      // console.error('Error while fetching data:', error);
      callback();
    });
  }

  function requestSpringCouplet(currentPage,pageSize,keyword,callback) {

    const first = new AV.Query("SpringCouplets");
    first.contains("shang", keyword);
    const second = new AV.Query("SpringCouplets");
    second.contains("xia", keyword);
    const query = AV.Query.or(first,second);
    query.limit(pageSize);
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      // 处理查询结果
        var poemList = document.getElementById('poem-list');
        console.log('获取到的数据为--==：',results);
        results.forEach(function(object) {
          
          // 将数据展示在 HTML 页面上
          var shangData = object.get('shang');
          var xiaData = object.get('xia');

          console.log(shangData, xiaData);

          var card = document.createElement('div');
          card.classList.add('poem-card');

          var shang = document.createElement('h5');
          shang.classList.add('poem-title');
          shang.textContent = shangData;

          var xia = document.createElement('h5');
          xia.classList.add('poem-title');
          xia.textContent = xiaData;

          card.appendChild(shang);
          card.appendChild(xia);
          poemList.appendChild(card);
          // 为诗词卡片添加点击事件
          card.addEventListener('click', function() {

          });
      });
      callback();
    }).catch(function(error) {
      // 处理错误
      // console.error('Error while fetching data:', error);
      callback();
    });
  }

  function requestZitie(currentPage,pageSize,keyword,callback) {
    const first = new AV.Query("zitie_pdf2");
    first.contains("author", keyword);
    const second = new AV.Query("zitie_pdf2");
    second.contains("name", keyword);
    const query = AV.Query.or(first,second);
    query.limit(pageSize);
    query.descending("createdAt");
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      var poemList = document.getElementById('poem-list');

      results.forEach(function(object) {
          var describeData = object.get('describe');
          // 将数据展示在 HTML 页面上
          var authorData = object.get('author');
          var nameData = object.get('name');
          var describeData = object.get('describe');

          var card = document.createElement('div');
          card.classList.add('poem-card');


          var container = document.createElement('div');
          container.classList.add('poem-container');
      

          var wrapper = document.createElement('div');
          wrapper.classList.add('image-wrapper');
          

          var imgurl = object.get('cover')
          var decodedUrl = decodeURIComponent(imgurl);
          var img = document.createElement('img');
          img.src = decodedUrl;
          img.classList.add('poem-cover');

          var name = document.createElement('div');
          name.classList.add('poem-content');
          name.textContent = nameData;

          var author = document.createElement('div');
          author.classList.add('poem-author');
          author.textContent = authorData;

          card.appendChild(name);
          card.appendChild(author);
          container.appendChild(wrapper);
          wrapper.appendChild(img)
          container.appendChild(card);
          poemList.appendChild(container);
          // 为诗词卡片添加点击事件
          card.addEventListener('click', function() {

            localStorage.setItem('selectedZitieCover', imgurl);
            localStorage.setItem('selectedZitieAuthor', authorData);
            localStorage.setItem('selectedZitieName', nameData);
            localStorage.setItem('selectedZitieDescribe', describeData);

            window.location.href = 'zitie_detail.html';

            // window.open(object.get('url'), '_blank');



          });
      });

      callback(results);

      
      
    }).catch(function(error) {
      // 处理错误
      // console.error('Error while fetching data:', error);
      // callback();
    });
  }

  
  function requestZitie_today(currentPage,pageSize,keyword,callback) {
    const first = new AV.Query("zitie");
    first.contains("author", keyword);
    const second = new AV.Query("zitie");
    second.contains("name", keyword);
    const query = AV.Query.or(first,second);
    query.limit(pageSize);
    query.descending("createdAt");
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      callback(results);
    }).catch(function(error) {
      // 处理错误
      // console.error('Error while fetching data:', error);
      // callback();
    });
  }
  
  function requestZitie_today_imgs(currentPage,pageSize,zitieId,callback) {
    const query = new AV.Query("zitieImg");
    query.equalTo("zitieId", zitieId);
    query.limit(pageSize);
    // query.descending("createdAt");
    query.skip((currentPage-1)*pageSize);
    // 查询数据
    query.find().then(function(results) {
      callback(results);
    }).catch(function(error) {
      // 处理错误
      // console.error('Error while fetching data:', error);
      // callback();
    });
  }