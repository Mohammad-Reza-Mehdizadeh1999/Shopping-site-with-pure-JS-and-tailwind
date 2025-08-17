let app = document.getElementById('typewriter-text');

let typewriter = new Typewriter(app, {
    loop: true
});

typewriter.typeString('با ما متفاوت باشید!!!')
    .pauseFor(1500)
    .deleteAll()
    .typeString("یک فروشگاه برای تمامی سنین...")
    .pauseFor(1500)
    .deleteAll()
    .typeString("ارسال به تمامی نقاط ایران...")
    .pauseFor(1500)
    .start();
    
