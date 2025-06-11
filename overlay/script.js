// --- Carousel rotation variables ---
    let carouselIndex = 0;
    let carouselInterval = null;

    // Mode options logic
    const modeOptions = ["WAGGER", "RAW", "C.BALANCE"];
    let modeIndex = 0;
    const modeText = document.getElementById('mode-text');
    const modeSection = document.getElementById('mode-section');

    modeSection.addEventListener('click', () => {
      modeIndex = (modeIndex + 1) % modeOptions.length;
      modeText.textContent = modeOptions[modeIndex];
    });

    // Editable section logic
    const editableSection = document.getElementById('editable-section');
    const editableText = document.getElementById('editable-text');

    editableSection.addEventListener('click', function () {
      if (editableSection.querySelector('input')) return;
      const currentText = editableText.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.style.fontSize = '18px';
      input.style.fontWeight = 'bold';
      input.style.width = (currentText.length + 2) + 'ch';
      editableSection.replaceChild(input, editableText);
      input.focus();
      function save() {
        editableText.textContent = input.value || ' ';
        editableSection.replaceChild(editableText, input);
      }
      input.addEventListener('blur', save);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') save();
      });
    });

    // Make twitch section editable
    const twitchSection = document.getElementById('twitch-section');
    const twitchText = document.getElementById('twitch-text');
    twitchSection.addEventListener('click', function (e) {
      if (twitchSection.querySelector('input') || e.target.tagName === 'I') return;
      const currentText = twitchText.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.style.fontSize = '16px';
      input.style.fontWeight = 'bold';
      input.style.width = (currentText.length + 2) + 'ch';
      twitchSection.replaceChild(input, twitchText);
      input.focus();
      function save() {
        twitchText.textContent = input.value || ' ';
        twitchSection.replaceChild(twitchText, input);
      }
      input.addEventListener('blur', save);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') save();
      });
    });

    // Icon group highlight logic
    const iconGroup = document.querySelector('.icon-group');
    const icons = iconGroup.querySelectorAll('i');
    icons.forEach(icon => {
      icon.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
      });
    });
    if (icons.length > 0) icons[0].classList.add('active');

    // Date and time logic
    function updateDateTime() {
      const dtElem = document.getElementById('datetime-section');
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB');
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
      dtElem.textContent = `${dateStr} ${timeStr}`;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Sidebar and hunt controls toggle logic (MAGNIFIER ONLY)
    const sidebar = document.getElementById('sidebar');
    const magnifier = document.querySelector('.fa-magnifying-glass');
    magnifier.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
    });

    // --- Bonus Hunt Tracker Controls Logic with Suggestions and Bet ---
    const slotDatabase = [
  { name: "Gates of Hades", image: "https://mediumrare.imgix.net/60206bb76f8d15dd2975ea5d5c908194c66a1183683e6988c83027ada9befbef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Super Scatter", image: "https://mediumrare.imgix.net/7d4fc189e6c48fd611846d6af0d1bd553fa0b9a2481fdeac29e05d864c36b82d?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Xmas 1000", image: "https://mediumrare.imgix.net/206a059864461c5bb63e1af83d5a105a2c36205cb8e01b37418f57d10d295252?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus 1000™", image: "https://mediumrare.imgix.net/8421465d345dc9f775ee55001e0337b80d86dd77f2de36e4cb3650a364210847?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Valhalla™", image: "https://www.pragmaticplay.com/wp-content/uploads/2022/01/Gate_Of_Valhalla_EN_339x180.png", provider: "Pragmatic Play" },
  { name: "Gates of Olympus™", image: "https://mediumrare.imgix.net/eb7ea358dba2cf7967e42f9c8327eb787dd9530d74b8cbdbfcecff9ccc962228?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Aztec", image: "https://mediumrare.imgix.net/0cbe57e4da0fb8361c4b1d40efe87044b47ddd24a577612a488eb3c79e0be455?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Gatotkaca", image: "https://mediumrare.imgix.net/0af25fe25fdd694509af52a1fb2bb725786d01bceda536f99ef549f0f1ea5967?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Olympus Dice", image: "https://mediumrare.imgix.net/9099ceb273c85a32737b1682ffefccb899a428ae16daadccf9b7cde80387ad52?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza", image: "https://mediumrare.imgix.net/f95b3adf9d28d57496dd8da909c0cb97515104194924c5abb4cc9ad792f35dfe?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza 1000", image: "https://mediumrare.imgix.net/445d5df4246639bd20337a70ee328301f1d949f4d3c2bc60c9bd7a31fd3636de?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Kingdom", image: "https://mediumrare.imgix.net/be8b9d3bb6565afd24db1b5418a3d235297dbaca52fc64c6affdbe98e5ae02e2?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza Dice", image: "https://mediumrare.imgix.net/d99d991fe476413c9ab9143c19e6add2761d182bfe3e05aad12fbd84da116cb4?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza Xmas", image: "https://mediumrare.imgix.net/07a13b91c0901e1d32ac71918f280ae48acbb684a651d08deef253812fca29ce?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Powernudge", image: "https://mediumrare.imgix.net/6f48e15d310da3000f6554aad1298b424acd06f8544c64ed68c484fbeafc6980?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 100", image: "https://mediumrare.imgix.net/7baf7257bf20524a6e25760fe034bbd129797f8ff2905ab22c5adc0c740319c6?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Rush Megaways", image: "https://mediumrare.imgix.net/9b4094155be45b4ad24cde1c86ce6aae384309f308da2190b61d0baa4f605446?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Gummmy", image: "https://mediumrare.imgix.net/ba614293c3ec7b1d3037a7211c7063e27ef4ef53ea75e45b4be03ea9bc764d9e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy", image: "https://mediumrare.imgix.net/1f358762243f6f9201258778752a0a0c64d820bef568dad2e6737f6dd4109f65?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 2", image: "https://mediumrare.imgix.net/cc54de090e5d4949aa9cd9286e554a0ea678f87b19b314daec29988ab9501ef1?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush", image: "https://mediumrare.imgix.net/d460898300e27164e6a059a28fca4b38582c07701a7298566ac08661c8b7dc58?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush 1000", image: "https://mediumrare.imgix.net/14d5410c6cf4c303d291262a10e949dc14b0ac2eca2a7a730b0401919c01358e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush Xmas", image: "https://mediumrare.imgix.net/0e621a565ef413c50798294d014cb1e96550effe8ab5befcd1d6774d9dc20148?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush Dice", image: "https://mediumrare.imgix.net/1dfa0e762f74219c3cdfe56428fed3130191f4ef289d1e7f5b116023a6d1e450?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Supreme Powernudge", image: "https://mediumrare.imgix.net/fc3a732b64a73b0011a0e55def22bb91de90bddf3637f5aad383fd30e47b1fa8?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Twist", image: "https://mediumrare.imgix.net/3fbda3cb3022ebe5175f345c8bd6ff4b3cc305f28b2b10c21b5762f788908623?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Rad Max", image: "https://mediumrare.imgix.net/912e93fcb0e5f52ee1f549d6b6ffcf21ba0847eef9c5003a28893274a6f1cb68?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pray For Three", image: "https://mediumrare.imgix.net/1ea39d28bbd9237c659f60233fce9bdd9f1c46b934c5d3b311f1580dbcea7f74?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Duel at Dawn", image: "https://mediumrare.imgix.net/81223334b34083d375cd42c6df9f0a5414b817e8ca16b54dc3b63e05386fc44c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wanted Dead or Wild", image: "https://mediumrare.imgix.net/2c04ff5694af0adf12b483a79567814407c1a4fc943b4d1980f84367a1910874?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Danny Dollar", image: "https://mediumrare.imgix.net/21e4b0ac5fd88338625abc758802e7f90156ae5cecf25ac236cd1a03fc0a693e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "SixSixSix", image: "https://mediumrare.imgix.net/30be38fdc2b4d9a6c76194314dfb7814a66d6905287ade354a0e5f2a79b1ab27?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Life and Death", image: "https://mediumrare.imgix.net/9407302fecd33613bc716d3b0d4f1e724334321ec910404f6b417284db593d37?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Viking", image: "https://mediumrare.imgix.net/2cb39e9486a6cd37f49767537241fc8b9f5fd302f17a79c06f5220afcea27ea3?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Pharaoh", image: "https://mediumrare.imgix.net/293b2337d4d5cfda999ca423e34518a1a6682062340f1f1c5a669a26e7927c79?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Le Bandit", image: "https://mediumrare.imgix.net/8ade942d35d2cdbddf7888f303be4cf4bda8c650a112b3c53f7c6f3ccad81254?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Spinman", image: "https://mediumrare.imgix.net/fcc00223f58811594d5c7db35abd3e2f1aeac13866981132e044333c75a4a3bf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Reign of Rome", image: "https://mediumrare.imgix.net/7c2dd8e10ca25f28737a4cc48c50b4b898c15b633ee14459b956237f2e58e185?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "FRKN Bananas", image: "https://mediumrare.imgix.net/d4c903b8aa3bcbcd3e7cfdd46e14fa5ff3f056922cd470a109438ee41184990e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rip City", image: "https://mediumrare.imgix.net/c55c2ec37c310140617b75c9e490faca98090292991840dce959d93649efbfa5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fighter Pit", image: "https://mediumrare.imgix.net/5ec25f926e0d9b8b6575aa93df1dfb769e7b6b2127f801d159994eb249eefe29?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wishbringer", image: "https://mediumrare.imgix.net/6bddae78f98ce6fc8d84be9b084d070cb755c3cb86b8ec05000f8af742536b66?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Slayers INC", image: "https://mediumrare.imgix.net/f08dd3c03232627f508e0b4f458651947e13e46f6d8a53be08507672256d3be2?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Donny Dough", image: "https://mediumrare.imgix.net/d0da486c2ef84196c52198fce55b4566303ef3d73d94c675179a8f6c4c5a3781?w=180&h=236&fit=min&auto=format ", provider: "Hacksaw" },
  { name: "Magic Piggy", image: "https://mediumrare.imgix.net/b18560b8631fc3b27c06d41e9729f7774048864ad7c4a16d1a20b1a953883943?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dork Unit", image: "https://mediumrare.imgix.net/33cd5a34c3937da326652a3beb44fe9c3680118c363a060ca5670847595561a5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chaos Crew 2", image: "https://mediumrare.imgix.net/9d93c95c411dde57286a1ebb9dc76d93ab8f0c49d1b1445ce7d316c36820552c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hounds of Hell", image: "https://mediumrare.imgix.net/05830ae2a958fe4b3d1c334ef2e93c34406fde0f9402969ef3a4d26992024e9d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Klowns", image: "https://mediumrare.imgix.net/075588ccb0fe1466d036afcd2386e173af3032773c0ed4e1c4b02b60ab630691?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hand of Anubis", image: "https://mediumrare.imgix.net/6d3e8501656c2ae403f7478d9bee1ffb49f81894b8f45ca42ad457a834a79149?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Thai The Toad", image: "https://mediumrare.imgix.net/715d1e5694973e27bac8deb3fd4c375135ca01517822bf3ab7a31888f7646119?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fist of Destruction", image: "https://mediumrare.imgix.net/c123ef1cf5a97e2c94cdbd6db80c47c35afa5af9837f1416eb25ac10dd6c8f50?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rotten", image: "https://mediumrare.imgix.net/da1d839ace20adb0337eae0b922a336d54df21aa2d8d616aad9f234a2ca38f90?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ze Zeus", image: "https://mediumrare.imgix.net/e20cf100fe7b8cc8f19a428ca222abd4f85c46679f876aa08fa2521248360b54?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cloud Princess", image: "https://mediumrare.imgix.net/c0be957b99d1a534b8fa221a225e87445766948f0b861b42700ad370fb84e22d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stack´em", image: "https://mediumrare.imgix.net/894ab0aba513722d8da9f3b118fb1197a00b248e40214b196fa7701265934069?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Miami Multiplier", image: "https://mediumrare.imgix.net/fdd4a97ee86f946b11c92f897c55696bfaabbd97002727c9d91b3c8883c31733?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Marlin Masters", image: "https://mediumrare.imgix.net/1b0d34ebc41450aedeb0720079aa82a9625da940ec61fbe2ef2b51f5a8b6d04b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Xmas Drop", image: "https://mediumrare.imgix.net/be3cf80fcd859427ca4ecabef13e7dfbee3603eaa3ed2dc975ccc1cb6ee622dc?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dorks of the Deep", image: "https://mediumrare.imgix.net/73558636b4e41b610e1e15aa8f527b84348895dbbfee8f02d1231af77abbe9b1?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stormforged", image: "https://mediumrare.imgix.net/35e02b639347011bbf26252e562f1535447edd5db692c212a0469c4ad5da512c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "2Wild 2Die", image: "https://mediumrare.imgix.net/cca5a281205cfcc8161b358091cc19e7af1385127754d005d4ddb12b8e9e2ba9?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Benny the Beer", image: "https://mediumrare.imgix.net/4ae57eafffc4f3253232b04ef6d9948eea70ef01d0337c56e106c773e92bc509?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fire My Laser", image: "https://mediumrare.imgix.net/7a29a0822d23020cd983ede3c4af9a90f065512b1cecd10d6faee751107a3bbf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Double Rainbow", image: "https://mediumrare.imgix.net/f2cea670f01b8351d7660385c688a0d30d5da4f201fd478df5d26ec9e78ce460?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Octo Attack", image: "https://mediumrare.imgix.net/9e3f45cf9ef13c45d0aa67f7c2e9ce49187e196db7d3e1c862427f72b7f121ff?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Phoenix Duelreels", image: "https://mediumrare.imgix.net/7ac7169ca980177d2f7843face3046fb42c001bf4dd7356becb037e92fc07ff1?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Densho", image: "https://mediumrare.imgix.net/eadeb726f36d9807051b6216e638c817537c8b4a39cd1e5de9017e1b0d6ea61c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Beam Boys", image: "https://mediumrare.imgix.net/d0d102db575ee3a3b89ae2a12ff27799ee95063fb1e97ae2c616b2fba5727bcd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Beast Below", image: "https://mediumrare.imgix.net/fad562df401ccfd1dde3707308efab027eea94a6cd11c35d64cc814efbb3a44f?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Drop´em", image: "https://mediumrare.imgix.net/dd4726f7b3ab5614e1e56c8314748397dc45f1d2a60d1a83a935a1fac95936a4?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Strength of Hercules", image: "https://mediumrare.imgix.net/92dc6be959aee15f956fd64e6fd3777274d9655724912343ec222235858e1fea?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Donut Division", image: "https://mediumrare.imgix.net/694d00465a62a9aa16b08c0739945ac27d025ca0f7e3ccbbf165f325b1ca87af?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Eye of the Panda", image: "https://mediumrare.imgix.net/740e91df538e182d4a8ceb6ada7a928a9cfd077796b52dd62b676bbb87a92575?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shaolin Master", image: "https://mediumrare.imgix.net/bff4a442bf939fb6e8d113fa34c1bfe514b520f5d27cc157ea4a9c1c48a3f53b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chaos Crew", image: "https://mediumrare.imgix.net/bececcbc4d481dfd6a4fd61f9263dc4bc28d319e93f4ff3fb04cd6c73b0e9ca7?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cursed Seas", image: "https://mediumrare.imgix.net/8a9907240271fd24b09f8c40964e3e7726e056302456e029ee25cf4aa5eb7f74?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Toshi Video Club", image: "https://mediumrare.imgix.net/4580fbe00b06937db40d6759fa65a17337e3c01b96d40d2333739b407be6781b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Crew", image: "https://mediumrare.imgix.net/66c02d382f74c7188da5306983f78f42d6aade7b388b8c149c3ac20117d69887?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pug Life", image: "https://mediumrare.imgix.net/7b18b96de662a92729c3aa7722f6bf872305f9a9d07a60c99ee3f23fc0198f6?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Joker Bombs", image: "https://mediumrare.imgix.net/6afdddc8fdfca2d0106bdaf4e8f02b6c1fbe455df3b855bc6babf6e0669dcee9?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "King Carrot", image: "https://mediumrare.imgix.net/9f7dd8932657e921d74bad8c9355fe6464e64dae26e373c87b554bb62c2e25b8?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Twisted Lab", image: "https://mediumrare.imgix.net/0ed46be36a9207f44ba20b50629d630446504a05db3c513a4b2e1e4abfeb5baf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Evil Eyes", image: "https://mediumrare.imgix.net/433a1bbc729168261fdc1af5d2047264768654851712d76ae933bcc84f3d5146?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Vending", image: "https://mediumrare.imgix.net/fa74f56742f954b651a006b25c87cf21717541033fbb435a53a10ac675ca2519?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mayan Stackways", image: "https://mediumrare.imgix.net/f13df3ab6dbb6f1bc732baa75113414ecc4aa04d1860bb009cc8aba4717f2f64?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rusty & Curly", image: "https://mediumrare.imgix.net/4fbce82073cab8684794cfb36eabd2cec98a0f7df2340a9ac0b308e0aee25ac7?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Itero", image: "https://mediumrare.imgix.net/34c5240f711e56c6af514136ff142cad4b39fd4c9aa3869b627ec010e6da559b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Get the Cheese", image: "https://mediumrare.imgix.net/ba6e2fa2799f1f9926bd2d79e2aa175669ea86116c4dc1e530893cfc68d0a57e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wings of Horus", image: "https://mediumrare.imgix.net/506275b06b8a03b332c806dfffd1599f32c68b5674f112cdd04802470a968f7c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rise of Ymir", image: "https://mediumrare.imgix.net/63ecb7db83f55f800b6c3c057c13f8a80185d4b767500b264867ae07aeb10845?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Immortal Desire", image: "https://mediumrare.imgix.net/1a7de51973e9c1298b1fa58ffe6bdd9ddb02c9e2df2c1adf62c7ca4b63c0b06a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dragons Domain", image: "https://mediumrare.imgix.net/b32ecba95ce52b451ff09fba9f89246ef4051abac52d250094627f0c5ef6c3e5?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Book of Time", image: "https://mediumrare.imgix.net/9bf10cb05301c16c0fb09d93ba8a973b834fbf76b5a37676878302e9c0e1d3d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Bouncy Bombs", image: "https://mediumrare.imgix.net/7f74559ba42c4b965d3f9809a77fbf366af4778bea4af823c9d661abe55302db?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Snow Slingers", image: "https://mediumrare.imgix.net/9048c86fad269aa7ff0abf63ee8c2ddc96f0bf4d5ae519231d40d85a65389986?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cubes 2", image: "https://mediumrare.imgix.net/017cf6597dff23e99f30b296c4162018320b4c6d4e0843b4e8c1d06e45827547?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gladiator Legends", image: "https://mediumrare.imgix.net/370c9ad85d5a47352f86357e6eec9bc13910b6b77985eb5ef1139cb39680c62b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Outlaws INC", image: "https://mediumrare.imgix.net/1df63aaf3942d0e8423a0343adfaeba4976c44e5ca7c2dddabeb7863fca63a94?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Buffalo Stack´N´sync", image: "https://mediumrare.imgix.net/5ca299b61c3c24a3f3c241360bb74cc7970f3b63cf5d2d9f9cdf2de854e06e97?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Bowery Boys", image: "https://mediumrare.imgix.net/153706d7dcb82fbf41e255df6f173ca042c6876bf1a25bdad3b5a669559c965c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dark Summoning", image: "https://mediumrare.imgix.net/7184d134ae7499ad10ffe6f985c3e0906bc2ab99518c182f7f53c08a260f095a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Undead Fortune", image: "https://mediumrare.imgix.net/86eab2d535cb53548f1a5aeacb04b08f9ee029905a7c658370d11aa14b17e3c3?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Frank´s Farm", image: "https://mediumrare.imgix.net/8493bbf7575c02b09d053ec3034532f6dec87301495fa5b0cdcd0a5cd297eeeb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fear the Dark", image: "https://mediumrare.imgix.net/62a6617f773bae2bf5e42516d725c4a00de48ecc4091fd37f4c897fe4d45be31?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gronk´s Gems", image: "https://mediumrare.imgix.net/0cfe7d7f16134b507f5f44d1cc74c885fc68ca6375147f31d3ba6b05ae9636cb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Divine Drop", image: "https://mediumrare.imgix.net/2e7edd753384f73be3253d4e68eb4c66319ec1161ef9c769dfbe6676ed67ca46?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Born Wild", image: "https://mediumrare.imgix.net/42393b8f277ee62dc05f00ed9b135e4fe7c1cfb9c8f95a44057a2ccead764e96?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cursed Crypt", image: "https://mediumrare.imgix.net/a3d5a4916410d4a5c0f0ce0e41180e388487c53fe106c454096bfd3fab821a66?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Keep´em", image: "https://mediumrare.imgix.net/b1b7c5f14a4f446855ca34c21ca56235a8e74ed1fd948eaccc81687367488216?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Alpha Eagle", image: "https://mediumrare.imgix.net/4824466ee7f5ebedde11e4a312cca6678d4f8b0f4ed004980fd15ff25dd9d1d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ronin Stackways", image: "https://mediumrare.imgix.net/68a04cf0d75f6fd3c1884805806e11ad128f09a8d274574ec99f34cd8f46f76e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Aztec Twist", image: "https://mediumrare.imgix.net/a033b9e2336fdd9ef2204f159b98577dcec061c1cea5841685521a165a64ff1c?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Xpander", image: "https://mediumrare.imgix.net/0ff16310e6d71b703046e87e30d66ce1a1b026316c24cc034e7731d04633d743?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Time Spinners", image: "https://mediumrare.imgix.net/ba3b2a5e0c0723860fa088fdcfa8216dec4d5023e6b9f291df95bfebc75ba223?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Temple of Torment", image: "https://mediumrare.imgix.net/7bf6165ab400a926c5abe6ec72a0bb755f637fcdbf0773e1f85f6607f5ac2502?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Break Bones", image: "https://mediumrare.imgix.net/c7e0eca2babf18eb00364a38d18f5e3cba868c9ff2480a98bbbf5a5ef203f1be?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Bloodthirst", image: "https://mediumrare.imgix.net/7bcad426782c83c08801d657c44cfb1afb5789c867bb21c01acc058af27e4cb6?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Rocket Reels", image: "https://mediumrare.imgix.net/7f73d6b27bf2af6b867937e9eb31617b6ff801f09135daf10c5d3d0da2d98b4b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Compass", image: "https://mediumrare.imgix.net/e2d08a4aeb8dc9aa5e076e4ec5e6f29217c0c963fd281059b1b2f401554fc2bc?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Warrior Ways", image: "https://mediumrare.imgix.net/7ad19594cf9ddfeb442c6cf1217e50f5a0586afebbebc5107c15a4f90080657b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Hop´N´Pop", image: "https://mediumrare.imgix.net/6605d3de0dd8b58b00db3054ab39e3c68d43cbccfd83ff50a13ade8fb5f21d31?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Orb of Destiny", image: "https://mediumrare.imgix.net/f79b83bc1408abd366a916e4e3b401dd76eb2a0cd31528067fcdb9072d5f7b1d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fruit Duel", image: "https://mediumrare.imgix.net/a188243dfba1a1bbc9eb9609c250693ecd3643cb57b1bb0adba320dd054edc77?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mighty Masks", image: "https://mediumrare.imgix.net/414115bbf7390de09bc1f349630e14b6b3e17b606ea18b3fb5d5ceebae601173?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Feel the Beat", image: "https://mediumrare.imgix.net/177e1af21ec99124784e606594f8447933ead39c3262eb50a8041f8adce28853?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Bomb", image: "https://mediumrare.imgix.net/12c3bb0487e2239772248e61550a121ee20fe8400a63f386d08896d1122d1655?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Haunted Circus", image: "https://mediumrare.imgix.net/b249d80cd1bb7367d3e9fe9062c04c28563a3050c3f4893b57392e3e132938fa?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mystery Motel", image: "https://mediumrare.imgix.net/9bb69ef1c5050873ce837473559ecfc7774d4f8ecc23c4e109ca441b12bdc523?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Keep´em Cool", image: "https://mediumrare.imgix.net/3d07ee2ca280623bb86771d146352267affb73d70dc878750fea88e62eb40553?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Dawn of Kings", image: "https://mediumrare.imgix.net/ee600c4d3d4145ef3d2501749e4f2872a68cdc47ef2dc17af43ac6a24b1eab1d?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Stick´em", image: "https://mediumrare.imgix.net/aa91b1aaf297b3c8f174c6364731135f14b55bdd47c60e9ccc1ccd8ef69f3959?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cash Quest", image: "https://mediumrare.imgix.net/96ab764e436daa2fb926d719ed3e6bda0c8f0f42a3d08f4bc4854c0d7a4ea0d0?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Jelly Slice", image: "https://mediumrare.imgix.net/9bcfcbf49d9b6184dec0dddd43d88e4ff7cacffd1c65c4202b03178bb4ae43ad?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Forest Fortune", image: "https://mediumrare.imgix.net/ad803f6a41eaf29721af391695c25656941eae8d3e1ab5ceb1dd692fd6b3586b?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Om NOM", image: "https://mediumrare.imgix.net/8cf1f4ee0df6994bbdadd377285357b241a51dd22b3e2fdf3bf6252e9816f479?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Respinners", image: "https://mediumrare.imgix.net/68f2388cb67b4cd35de210c31f5ca15bbe7f3e904e26a50a63315a4d2568f1eb?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Frutz", image: "https://mediumrare.imgix.net/b5d02c384a3e96a30e90018887f14d0923a2c05e582abd4cfa18fd600d7fa94e?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Cubes", image: "https://mediumrare.imgix.net/cf92f60f919b018998478dd92fe93193ab77cdce4bdd5b2ca826dd9b0a38055a?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Tasty Treats", image: "https://mediumrare.imgix.net/a478052cb3a60aacfdcc4dacea3d0b4ea0a095c28e55ccabafd0b64f3c4fb9bf?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Let it Snow", image: "https://mediumrare.imgix.net/22d5ab5f65de364fd4573409289caffbf7cd4c1696ffdc8cbb6e0c0f5ca2aaff?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Harvest Wilds", image: "https://mediumrare.imgix.net/cc2173ba768f9fa72a884bb8d475c47ab13d44b25a275972255ee4fd85331a99?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ethenal Nile", image: "https://mediumrare.imgix.net/8621688f67c74a42471c052dcc3443c754617d159258554125da3dc1e1da470f?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "8-Bit Quest", image: "https://mediumrare.imgix.net/c24f8c668823b8fc9ecaace4ec2d458d28106c6247b4138a561d38db6b705455?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Monkey Frenzy", image: "https://mediumrare.imgix.net/0b60d8d6e4080095e0cb2e7efd68436ec285135fc00ae0bced559815ffcac7bd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Sticky Candyland", image: "https://mediumrare.imgix.net/01d620d4903a3f14b397ef202e934cd4e9902ad01794e7bc20903fe156a2a5b4?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Library", image: "https://mediumrare.imgix.net/66dd42db2459d2b0a8fc356ed18ad0b3489b562ba80446496c4a8fa908c134cd?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shadow Treasure", image: "https://mediumrare.imgix.net/04531340b93a65869cd94e56b921bb3438909d61336954c94f7824f8266b1f03?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Lucky Multifruit", image: "https://mediumrare.imgix.net/07dfe0313bf45e0d937f277cbf11f9b2181520f2c0c2a01e4b7d539365e6bd18?w=180&h=236&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Duck Hunters", image: "https://mediumrare.imgix.net/34ee5a63f09ad96cd4d92ba752de18ca210df5439723203c26f385bed7ee97f1?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kill Em All", image: "https://mediumrare.imgix.net/46ba3573140d67ff2eec9e1c06b37518622d5135bc7abbb590f432a428980267?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Highway To Hell", image: "https://mediumrare.imgix.net/580786a24cdc3f5473c5f00ed5566b58b8b375de32a03284c80f9025d455bd50?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Mental 2", image: "https://mediumrare.imgix.net/3ca0964f7fb9827c900be70a2a0e23005f2b0e4aa67b57365336766c27a7cf40?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Outsourced", image: "https://mediumrare.imgix.net/21f2d81592cc36a42d90f4be5b501f1ef6490c5d0528577aedf76417a25d7fa2?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dead, Dead Or Deader", image: "https://mediumrare.imgix.net/fc101acdf7ca30e3e78e78e853aa11d9ac0159ef88062ffc72408637de549d47?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood Diamond", image: "https://mediumrare.imgix.net/8eba0badef103f9a7179f2f5cc7b8f091bda4f3adb873ac15d28f0dddb5952e0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Nine to Five", image: "https://mediumrare.imgix.net/c06ffbd9ac77f592824e0393517914beab310640bcba1cca51731c141d8fa566?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "San Quentin 2 Death Row", image: "https://mediumrare.imgix.net/bbbeff94e0b2956633a6a1700e38f39450696673391fb991f8c96d3c5c86157a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Fire In The Hole 2", image: "https://mediumrare.imgix.net/d93aa56548ee2716b2e743e2b6a0d04a4bcbe6507964367d50c3529ab886ac85?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Brute Force", image: "https://mediumrare.imgix.net/2bf6daf687390406257eb7a19c6789bd363a455aeb155955fda5030644e5d431?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Xways Hoarder Xsplit", image: "https://mediumrare.imgix.net/626864b91465700ae03a98e2f4254b6461b97906c0daa572b3bca4e103c0a745?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Book Of Shadows", image: "https://mediumrare.imgix.net/2c68bb24ec9e031476516000d76f563ecb8f7197b63eae6aed241245f7dcc515?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone Slaughter  El Gordo Revenge", image: "https://mediumrare.imgix.net/dc6e003dcb26eb6adc4499660abeac536f11101fc62b79cdd28931109fc9a376?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Mental", image: "https://mediumrare.imgix.net/e96a6381078a53449a8ca14f35786f2afe5c0007254bc2053bc1e9ba2a0715eb?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Home Of The Brave", image: "https://mediumrare.imgix.net/0bc0abf755f1e81014bb1e0204d6e0339663ed88c20ef9a2228860d82bf45525?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Crypt", image: "https://mediumrare.imgix.net/3285df789ee1e5f52e3b075b4eb0c1f080fcdce28f7c9689daa4e62f87fa85a3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "DAS XBOOT", image: "https://mediumrare.imgix.net/822438dc4259368302ef5ec6345c4c21a73097e4265f21f53008cef1e79f6cd0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Brick Snake 2000", image: "https://mediumrare.imgix.net/904a92d026b8583a219d86f3aecaf739b72a7313ece71b6aafdac3c179a5b4ec?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kenneth Must Die", image: "https://mediumrare.imgix.net/355d623ff7dcacebbdde1aec5ea2cf741935bee9d9eff8eea83c78590f22690b?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Loner", image: "https://mediumrare.imgix.net/c4b68434aa2e8f5ce669b670f3a99b8fb0550fefd2390ae0f9aa14ff5f8a209c?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Devil´s Crossroad", image: "https://mediumrare.imgix.net/686f4b4366094b5f4ce040c7468125b4b18e7764c982237af9d1c79c645839c6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Road Rage", image: "https://mediumrare.imgix.net/fd404858468d9f561073b9dde3bcb7cdd5a3d9e22ae1e47f97781a86535fa55a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone Rip", image: "https://mediumrare.imgix.net/79241625ea0d952c1ca3fe1b5fe1c50b408c1d35beb7096dee3e40858b8ce3c6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Karen Maneater", image: "https://mediumrare.imgix.net/9dea511342cc56765b3569497ba3b21d4acc46f8d9c79bac96c79dc4bdf8ce22?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Deadwood R.I.P", image: "https://mediumrare.imgix.net/950a8d14e60169197cb5b26dcaebf4aff9375eb99eb5647c72d455f2ceb52948?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Apocalypse", image: "https://mediumrare.imgix.net/2cb50b6da92786adf437bf9f7c7d3976608f0a4db302446cf2edf1ac8d62fa1d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Rocker 2", image: "https://mediumrare.imgix.net/ed445ad8db1ce3aa5bc3de4abcf815fcc56d2b77fbdf721d75527ffef10f04dc?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Infectious 5 Xways", image: "https://mediumrare.imgix.net/3a867a309eb8fddad57081585b8e6d2761f40a0bed4c0390baa36a355135bd00?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Folsom Prison", image: "https://mediumrare.imgix.net/7302b9247bbb9187df5ba750f1afd2d07f9ef093bb5fcc9aac8b23854f59adde?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood And Shadow 2", image: "https://mediumrare.imgix.net/c938eba95cc562f4976a5e87cbcc5293b7b4a9d294f85465dd0b05e0d6242f3b?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Misery Mining", image: "https://mediumrare.imgix.net/52ec64ba09cf9dd206cbdd1e66b6b5abd8052c601fe425c7a95901e88012bf37?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Buffalo Hunter", image: "https://mediumrare.imgix.net/66a79f68725b5d3fb1e940922a2562a3500f3daac56a9d056b00ce9b5a839a71?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Fire In The Hole Xbomb", image: "https://mediumrare.imgix.net/1c880d29afe39363c2b912fa1f90097eee2d39219a3dc3c224678f4dd520fce3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tractor Beam", image: "https://mediumrare.imgix.net/7222443c7b5d9b96d4dea8b1090470defaaeb7e78de9d5c4ef0bb981a3ea4bdf?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Pearl Harbor", image: "https://mediumrare.imgix.net/cd746fb8aa1bfe6e90ecd47b3d420938d7058fa1c97fb43330b65b70ba986c35?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "D-Day", image: "https://mediumrare.imgix.net/5034da0890a57d6de36866165567e60c21d55a123ce8b90f953fa806095879d4?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "San Quentin", image: "https://mediumrare.imgix.net/ca243d6c3db42259d6859b80717eb378eb64e41a9d1b1f7fdeadde68d59d9ad5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Land Of The Free", image: "https://mediumrare.imgix.net/6128e2d70db29bfcfe14269b652524ee51b931dae9f11469a74c14be004cc879?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Warrior Graveyard Xnudge", image: "https://mediumrare.imgix.net/db4e73c4812e1ede12d2f34ce9a07dbe7ac1a02d6585510eb5e04ff439ab3f71?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Deadwood", image: "https://mediumrare.imgix.net/624759841db8d261bbc83b9bbb8111d40b95ee4d9c025ca7d364e0fbac410ba0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Eas Coast VS West Coast", image: "https://mediumrare.imgix.net/f32b71c88d0fb3be4b93c136af771aadba05871986136b73e75622b1e8f30700?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Disturbed", image: "https://mediumrare.imgix.net/8b474e497d0ea0109e222b226456da1828913a605890a82dc4bb42d439fa05a6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Serial", image: "https://mediumrare.imgix.net/07567162f12d9e51847089c49f835445527e03a2d0fc17d7d1c770a69c1dc74e?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Ugliest Catch", image: "https://mediumrare.imgix.net/00fce06cc9f7bb26a217180b623b889df1e9e3c320d34156cdaa78ccf0138595?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Stockholm Syndrome", image: "https://mediumrare.imgix.net/0b1a1fb092eecde4752edbbdae134e7a4eca6235787211d5dd2435fbaf3e8f45?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Beheaded", image: "https://mediumrare.imgix.net/830c55f0c73ea21aaeff830abe90d0a5cd2f403503b900b5e2aa72129b421769?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Remember Gulag", image: "https://mediumrare.imgix.net/8744b8f4130b95ed84a3bf7e8a59cf35cf01a8ecf2b74818f9beb0d599eaab39?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Jingle Bals", image: "https://mediumrare.imgix.net/c3453f1b5a16b59fb682d55c8e75d542b0b6763d383a47c5d5c24d7f03e53f30?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bonus Bunnies", image: "https://mediumrare.imgix.net/80f2d2c4447e6e06d95b9af7f94165f577d74b78f24b25d753b5954fb0941f83?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dead Canary", image: "https://mediumrare.imgix.net/7c5ca2b52a1298a4592a9650830d68e67aff4a10408a15d465bb8426cb78fc82?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bushido", image: "https://mediumrare.imgix.net/256162271648c5c96d48e317c4760d7fd1853809e986dfbff8bd54d31cf20559?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Evil Goblins", image: "https://mediumrare.imgix.net/316bbcb1821c748b04fb87e64b194f9c155cd690ee307ec34a4392094e940826?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "El Paso Gunfight", image: "https://mediumrare.imgix.net/77cc160d9914ddcce1dfa45afc5d14f0102fa155b1bdd4b7433ad1a5b0f9a782?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Benji Killed in Vegas", image: "https://mediumrare.imgix.net/e0c840c69bbe217171b51fd911a7d633eebe0a1102b6d96fce9c63d6585ece05?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Monkey`s Gold", image: "https://mediumrare.imgix.net/fa869ff59279fa8a9095fee189e02f5db17f6039d7d9b791765d1c195b1d5ce0?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Thor Hammer Time", image: "https://mediumrare.imgix.net/5885b413efcf20331294f32e6abd70849cee0cbb75c19207686834960b7a7d7f?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone", image: "https://mediumrare.imgix.net/01148bdb8a08eae2e8817514ddb68fe6eeb3427390b00cb319e047ae4b1cd766?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Possessed", image: "https://mediumrare.imgix.net/68002032e338e4512a2194d9030b881cf751bed957fa5e3e04c07d81b94e962d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Space Donkey", image: "https://mediumrare.imgix.net/eebe8afe073a7327804cd10f8f8be06c95e70479723fd6ab71b554354817f9b1?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Rave", image: "https://mediumrare.imgix.net/8f0d64d9be52111d617021b56f7fc822a898fe72ddae05df93d9e6926a942a54?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tombstone No Mercy", image: "https://mediumrare.imgix.net/a8d6291dc467a3b9d33e3a0d85e6a364d1dcc777daaba11cd8c1a4289e177ca3?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Roadkill", image: "https://mediumrare.imgix.net/ac312a93e3011a33f9b2886df8eaf88ba8d17d6e06714e5292306fd31122ce9a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Toilet", image: "https://mediumrare.imgix.net/b7e23fd8bc2e4047abe21b26be8903a52aa0f11b0fef315d7cd9695dde5f2276?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Boarder", image: "https://mediumrare.imgix.net/655249307fb8240db8d6648421990843502a793ec60591c2b27fdaef744795e5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Waked", image: "https://mediumrare.imgix.net/2d4e31f4a7d5f7ea70503d5ba99ce20b2e6eb6bf6aaa63a5e4cfca5f8186a5e9?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "True Kult", image: "https://mediumrare.imgix.net/b8c7c54caa9354397386209f1598af6061eb2e8620221ac111646f312351e733?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Barbarian Fury", image: "https://mediumrare.imgix.net/4504d296fc5f1e9fe5445e61e11f721b10cbc8f972e678872601e8691fee2cbd?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Coins of Fortune", image: "https://mediumrare.imgix.net/63d079d1db0688e108015d5375d3f9fceef3ee7f840eb3bff981c95e7b544f59?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Blood and Shadow", image: "https://mediumrare.imgix.net/51c4fe897d1c10590b228d7255b6c474357ec6f1c04e4286b03d52a197a3c222?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Kiss My Chainsaw", image: "https://mediumrare.imgix.net/bdfee60eeb0e46f3fde4cf7e2672711715c978f07392ade094836b5dc32b49d6?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Tomb of Akhenaten", image: "https://mediumrare.imgix.net/c9d4e56962e81284b267b4ea668fc830fab41a96cf2f4a1158a446e5872823c4?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Legion X", image: "https://mediumrare.imgix.net/dd3d10c1778385d21443f1807c64f22b34d2a65c52fa4eb695b6e260c40554b5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "True Grit Redemption", image: "https://mediumrare.imgix.net/68552e953aeae114fe69fbfc5203b2ef2b2b2fe87bc9b277ebdb593546a3bfe5?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Gluttony", image: "https://mediumrare.imgix.net/df36859126cc991e9a2766277d7356cc4c8dd3d81db3f0a0720dd9aecc13e491?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Little Bighorn", image: "https://mediumrare.imgix.net/22d2c08af82a97b0644063771563b61a0b7053dc095f123bf74d83aa0f7f2f67?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "The Cage", image: "https://mediumrare.imgix.net/26f729a51236a7c96e45453f9643a8bb99b0a65835fd05049315929ccfd36d5a?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Rock Bottom", image: "https://mediumrare.imgix.net/51f733ffc60b5da5daa4fdb1a5174e10c1c31b2bdd454f1d068028cba3280995?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Golden Genie and the walking wilds", image: "https://mediumrare.imgix.net/23a5e9d40a75cbeb124c527b989fd48468fe45db9a1639de91cc5f52d19d7b26?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Gaelic Gold", image: "https://mediumrare.imgix.net/8efc6aec875332fb59e5767ee16b69edc2e4fb277fa2acccd896f21a0bbcc37d?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "DJ Psycho", image: "https://mediumrare.imgix.net/22c9730272521443996cbe24cd2011da48e6caff4543c99fcebd0e584a10d365?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Punk Rocker", image: "https://mediumrare.imgix.net/0a1d1fa465dc6842277aa8f2ce462932269f6e7cc1b680a0de201fdaa25d3fbc?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Walk of Shame", image: "https://mediumrare.imgix.net/e9d1159dc4ec26b40a436c9f1c3bceae323c552dd1e5c206d6ab4c93a61ba7fe?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Dragon Tribe ", image: "https://mediumrare.imgix.net/a2f7dabe8bc0947a89e80a60ba13b27814e5eef6bd1d45b4082c7310b9468463?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Bounty Hunters", image: "https://mediumrare.imgix.net/1b3e19c5dadcd298327774785a0ef6dad6128a2ffd323637a85eb34ed859b3ef?w=180&h=236&fit=min&auto=format", provider: "No Limit" },
  { name: "Lucky Barrel Tavern", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-LuckyBarrelTavern.jpg", provider: "Belatra" },
  { name: "Pirate Jackpots", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-PirateJackpots_designed.jpg", provider: "Belatra" },
  { name: "Big Wild Buffalo", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.belatra-BigWildBuffalo_designed.jpg", provider: "Belatra" },
  { name: "Gold Rush With Johnny Cash", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.softswiss-GoldRushWithJohnny_designed.jpg", provider: "Bgaming" },
  { name: "Ultimate Slot of America", image: "https://mediumrare.imgix.net/4e212f817a163d07b8d65cda3e07ec94e2dac06cc520b26ff98ed97d4b63e33d?q=85", provider: "Hacksaw" },
  { name: "Crabbys Gold", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiIzlYWupxTSBhZzJ13zkZyp3saTRA7eml9Q&s", provider: "Play n Go" },
  { name: "Alice Cooper And the Tomb of Madness", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_pCgBW35jR7SNLHawrRNh0qP-vLcM0dQCEg&s", provider: "Play n Go" },
  { name: "Mighty Munching Melons", image: "https://mediumrare.imgix.net/148378d0a48bc442079c38baa4a8dbd1c44f5edbe34683321efba6d34a783d37?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Sky Bounty", image: "https://mediumrare.imgix.net/fbd7a2ba07635bf8178c91c910f92d85ffa4fd4320a52885e7f6d005e872b8a6?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight x1000", image: "https://mediumrare.imgix.net/95b7a5cf3b8fb3c41d81717e4bcf4dd615a0cc2256faee80684d824d93a3d3c7?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Pachi", image: "https://mediumrare.imgix.net/b5e8b647424bb8960eb480cd8d0015fc2a5e6af496255608a6ce6149521a1dfa?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Christmas", image: "https://mediumrare.imgix.net/95ae43b4eac22162e71ece7b111c5a45ae1c93bdfdeb141d3ccea0bc6652c0ef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Starlight Princess", image: "https://mediumrare.imgix.net/298229a9a43ea31dd37bb4f356055014eb7e45c570cf06aa59cb2bacbdd65919?w=180&h=236&fit=min&auto=format", provider: "Pragmatic" },
  { name: "Coin Strike Hold And Win", image: "https://mediumrare.imgix.net/1bbcfa17f0283f09c5edf293c154574c927df12bd52775fc6dc874641d11759c?w=180&h=236&fit=min&auto=format", provider: "Playson" },
  { name: "Hoot Shot The Sheriff", image: "https://mediumrare.imgix.net/2dd6367518c2dde0ab0be6dcbf67e27bf31b360b1723402ecd3cfe47b6f5c7d8?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Home of Thor", image: "https://mediumrare.imgix.net/494fd72c6cf90e055067ad69506ad0b4a7cde8b99fe8847ffd09d77b5b125e36?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Roman Bonanza", image: "https://mediumrare.imgix.net/73ca7c50b447324bb570226b2efe75d420ad977aaee516e6697c955e022a0de6?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Gladius Death or Glory", image: "https://mediumrare.imgix.net/789931cb460223cc303dcec9bf8a2e4c8c431cfd8e78c84f979f1eb5ad4cb653?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pirate Bonanza", image: "https://mediumrare.imgix.net/dadbe45e9f2c2f6a057f168e0a9ef68077f684d9bb26db491ee9e3b49229c8d6?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chocolate Rocket", image: "https://mediumrare.imgix.net/a858c07e77c66ada9faf506731adf24b23f67e29a0c424b342fef668006c2c1e?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Chicken Man", image: "https://mediumrare.imgix.net/780e3ff5ea3219edf3f7b75223a5ed9064131025479d0da947877534a6d9180a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Barrel Bonanza", image: "https://mediumrare.imgix.net/78853c4c98bbc63173678f9a29fa16f693261b7d72b5fc21754dc780f8e376a3?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Sleepy Grandpa", image: "https://mediumrare.imgix.net/a5c9c0e7964070f2ccc2084e5805f1f4847d640e1a1c3f8e32dc37be96131d8f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Super Twins", image: "https://mediumrare.imgix.net/eca3bbafa4c064ef4e32c908bd73c2060ecfb9ce71e5fb6f219c6d731a0d5f7f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Clumsy cowboys", image: "https://mediumrare.imgix.net/4c89dd9137d1f916f9c61059e50ef52c7aa797a6b29bed222c41c35642c48e1e?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Shadow Strike", image: "https://mediumrare.imgix.net/f7043863474ce6a878eba4d1beb8c945be72b8fdaa79a48674e031b286e85488?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Blaze Buddies", image: "https://mediumrare.imgix.net/98b3f905da6fffb734d1333f5c6e1be3b8f4d50427339d11d1a2a58134d88e86?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Crystal Robot", image: "https://mediumrare.imgix.net/e20cb67dce597579213cf775cd799a6b5c0d312df0c155f7ed56669668824975?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Old Gun", image: "https://mediumrare.imgix.net/651407a0e2f495f40a4437b70e2cd22251030892709d8941577dc4d56042c042?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Infernus", image: "https://mediumrare.imgix.net/3cb55c7cef40ec3e4c5e72a31878a1eada01665bed706b23ae0375cd43eb6743?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fireborn", image: "https://mediumrare.imgix.net/ba872c286648c95b753edd2576f28592d947ebd27f100eb60ba98b5bc388d502?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Desert Temple", image: "https://mediumrare.imgix.net/598e3ad44572857dea16a8a0851618cc2a487f19cb9a21f8e8d165a020eda510?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "The Cursed King", image: "https://mediumrare.imgix.net/b7306f0ebca9848dbef7dd4cd9e229c0673df5a95c61e30efc4a1cef7e1bbe23?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Commander of Tridents", image: "https://mediumrare.imgix.net/c8e85b5b311d82a8bba1b76429384f0c33178e25c63f2f86b38d49acb8b6a372?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Space Zoo", image: "https://mediumrare.imgix.net/40e5fc070c8c0dad1d726ff7010f49a1adf459d34d79a059323a0a2140da1adb?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Blade Master", image: "https://mediumrare.imgix.net/07a947a8fb11abc7aa52c9628a94d0a997b254b0759dfdf4a4c08359660351ba?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Fury and Fortune", image: "https://mediumrare.imgix.net/9ade85dd180196247b53d8c254f4671255b34a44d8dba44b50d658db065a6f8b?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Age of Seth", image: "https://mediumrare.imgix.net/92e2a40a3d7a55c8d768b817bcc2b4ca91a30808de3784f40288496e7854e7a5?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Pickle Bandits", image: "https://mediumrare.imgix.net/001a175a54e58ef21a2db846cd9f8fae84d9092d09150c444fdefa34abe11f7a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Ancient Paws", image: "https://mediumrare.imgix.net/76920357a8ae701cab16a1157eec612bbe4e87a301c13493af5caf2d89bc970f?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Valhalla Wild Winter", image: "https://mediumrare.imgix.net/e8cd1684359b7db17be29356fb29a7d5cefa42fef7cbddef9cefd4596c167eb1?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Clover Club", image: "https://mediumrare.imgix.net/95a3cfec930a6c90174d1c2699ec737872ee9ba6a8fd1fabc6f9abd69144d26d?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Jawsome Pirates", image: "https://mediumrare.imgix.net/6574ed2ce9866147ecb75af5ba09d7d2e84203d3872a40d27aea44f2865346e9?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Junkyard Kings", image: "https://mediumrare.imgix.net/e996d178a481fdf2f0f190ff3533c9aa69e7cce37b092d9a18bece5ad8664dde?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Amazing Miceketeers", image: "https://mediumrare.imgix.net/30f7870d14c0414bd140bd9cd6bb7ee0e401a8be1fc1e43b8bcfbbb3ea6e4d9d?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Mafia Clash", image: "https://mediumrare.imgix.net/430d97801ce54a8813dfee68c893cb9dbef32a3ca43b17d71790d86e7e01bd55?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Empress of Shadows", image: "https://mediumrare.imgix.net/aac93823c6b13375e6b5ac9ef4007d73f31e6abf93c72173962683768487a447?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Piggy Cluster Hunt", image: "https://mediumrare.imgix.net/040b99f34688458edcfb0aa6e9c7be4c0796d45e93629799aacec22946b82331?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Coop Clash", image: "https://mediumrare.imgix.net/75fabc4e0c30ff04b74baf6e55572e0276cd7b176407f94bbd145abd4d657511?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Holy Heist", image: "https://mediumrare.imgix.net/24f65e1310d76a41e84570b874d8c8c55f874b11a4677a8f090cfd81f793594a?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Wild Dojo Strike", image: "https://mediumrare.imgix.net/9c204c09cc4a6f9487f8783967f97d7f164f0467d35010e1529f5540db55d536?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Merlins Alchemy", image: "https://mediumrare.imgix.net/65cdec3e6fd95d36b9514019cb5f52e3a6a8aabcde244427f765122d71ccf424?w=360&h=472&fit=min&auto=format", provider: "Hacksaw" },
  { name: "Super Sticky Piggy", image: "https://mediumrare.imgix.net/930b0d1222ff53fd1ffbb7da06404686086ab76cfa0534a9cedd4808351eac7e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Azetec Temples", image: "https://mediumrare.imgix.net/071784a3c8fb2f33db1d0239e5bbb5142ba5e67ed5a68062c65a84ffd90d8e82?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Express", image: "https://mediumrare.imgix.net/04f5a2af73d423c11b88f5617c5e33c6549cb25d46f16d5d6a1fa4ca178a34b7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lucky Penny", image: "https://mediumrare.imgix.net/28a4db71a382de03662ffd82a60d849ecc411c1ff8e1305afc4f393a3482142e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Up Hot Fire", image: "https://mediumrare.imgix.net/9ed38eb56824505f9383f13f20b8425432e74dbfbd85fc94c3cc7253708cb1a5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 China Pots", image: "https://mediumrare.imgix.net/db9c7dd74f574eb8152a25571a13bd5773abe6b02f89ed02af5ae0b4d7f7b5db?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Azetec Fire 2", image: "https://mediumrare.imgix.net/d1c594b4d290e28426d986815bbc15c84d84c283103c5becc2ad799a9d50e751?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "15 Dragon Pearls Hold and Win", image: "https://mediumrare.imgix.net/e03cfdaecaf15311d6dcb09bda329a504de15c8bc6b0fe05afc6ba51c5646a07?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Coins", image: "https://mediumrare.imgix.net/621fd8e92d3188f5cef0101653efd26fed12e6dcdfb35df7289b485f1218e41f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Clover Pots Extra", image: "https://mediumrare.imgix.net/972fe13ebdadaf052c44891e1ecec455d7b5622670eed5c17d2f8c8d3476237d?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Power Sun", image: "https://mediumrare.imgix.net/45f92b15b5bdf43a622b049d4b8f7acc26a0693ed1302c26bb12829e74bc0be6?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Coin Lamp", image: "https://mediumrare.imgix.net/57199aa61a0f2189cca12cd12c5a8e4e5dd0541399cce6a9332e48212e998903?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 african Drums", image: "https://mediumrare.imgix.net/e1dcddd9e52221ce7dc2f24a29fcbec3335ae336e11a00bcde05c26ec35de7fb?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "777Coins", image: "https://mediumrare.imgix.net/5fdd0f5ad0a7dd0e713db0f1372aca76de49ca0d6866910c3a3e3268e11989d9?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Clover Pots", image: "https://mediumrare.imgix.net/44e80eb7111efbe9927c6101eea5017eb6dd9526425d27be53ef8a845a6c4dbf?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Gold Express hold and win", image: "https://mediumrare.imgix.net/5d0a130daf3e7ed5cb2823e9d303c98993a6f3f7a9d96d67209113cde549f13c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sticky Piggy", image: "https://mediumrare.imgix.net/deefc5e0757b58b3b72e85d8b93e684e2c18de266e9cfe3e409ac25d1d809237?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Black Wolf", image: "https://mediumrare.imgix.net/60104008239b3b6f734862dbd9d731f6d9f664d0a22105e0a7acc72925fa2720?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "777 Gems Respin", image: "https://mediumrare.imgix.net/1ea512d33cc417120241529fb5f561029696978431148c2ae4c9f3a0fa976af7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Coins Egypt", image: "https://mediumrare.imgix.net/57cdd483aea608082a1c8400ac2fbee62adf7953f420e1b691f2e0db01756288?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Aztec Fire", image: "https://mediumrare.imgix.net/4cf62cb9a03c4044b8e95130b71602d672491ff2c18d52f5fc3b21a69250940f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Boom Boom Gold", image: "https://mediumrare.imgix.net/a3b2f5cf9c9af7b002782e14986c4edf6db349d2a77ae5757b897f37ed18fcf5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wolf Saga", image: "https://mediumrare.imgix.net/c52670de69bf9624d0750e41d37b6e4874acb2c0f009b652c6cc263e61ce566a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sky Pearls hold and win", image: "https://mediumrare.imgix.net/080225396949e7289ee4d69fb7bdd20692020516a8c60daa512e0148ba5b980d?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Super Rich God hold and win", image: "https://mediumrare.imgix.net/b79ac43e2450503e1857123a8a20f6e6e99975a1f31343f48b1aceee35c141c5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lamp of Wonder", image: "https://mediumrare.imgix.net/9ce3b4a76552122bffc281f4f827d61ec97900ea599ff77cab9b0511febe17eb?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Aztec Sun", image: "https://mediumrare.imgix.net/92f1b5880c722df3a8cbcb33bb0589112a9c6b2fd7623f889cb4ec170a16c0c8?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Green Chilli 2", image: "https://mediumrare.imgix.net/12599373725b87b6ec24797e33464bc0292d54834e73442ed215871660e6edac?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Gold Nuggets", image: "https://mediumrare.imgix.net/9bea1531180cb2c1dcc7b5dee11cef7d1a13d164ed491c8fcfbd41cde742430b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Buddha Fortune hold and win", image: "https://mediumrare.imgix.net/35667059107b4c4553e97529b46ed4a43d7ff92d09f1f206c7b562ca0831ecfc?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 3", image: "https://mediumrare.imgix.net/35667059107b4c4553e97529b46ed4a43d7ff92d09f1f206c7b562ca0831ecfc?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Wizard", image: "https://mediumrare.imgix.net/8a200ff10c0a0959191eeec4a04e81abf1a4e3f38ef33c036c766ff45d4a204b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Egypt Fire", image: "https://mediumrare.imgix.net/079efcf2de2128c051851169626a122c675f9537858fadde2701740a88a13540?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "3 Egypt Chests", image: "https://mediumrare.imgix.net/b11b369e363bbb7f4f737c131b331b2dd6cd1bcfef93ed4ed668f3c0476d0477?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "More Magic Apple", image: "https://mediumrare.imgix.net/a083159b729f372718228af4c8846d4e340f8f277dfdc57159861de709f706f0?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Black Wolf2", image: "https://mediumrare.imgix.net/7eaddd14ee23047b93e35de60e9f219359f15b0f8db01e9cfdd7bd072e32bd1c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wukong hold and win", image: "https://mediumrare.imgix.net/939dda8ac532dd70b2be908d0f9f5a3597b569f8a1fdbfc0a83e932d4fce0240?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Candy Boom", image: "https://mediumrare.imgix.net/ad2289244507a5703e9d92f3c9bc8905ef2972e4a21bdfbaf232a37972c5f801?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lion Coins", image: "https://mediumrare.imgix.net/d13ff7870a2b75ac9f85715e87e8e8c86072eaa6a1b2ac8e51b9b358955beb5e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 4", image: "https://mediumrare.imgix.net/e8d47571b009ab8ffe6dd37a647679301b30dd111d99c0f4b5c578a1f0becffe?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Super Marble ", image: "https://mediumrare.imgix.net/00386712d83db3dccfed2ba1b97e04251410f74f3b9de4d68f35adafed75f1e7?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Wolf Night", image: "https://mediumrare.imgix.net/1a9d36ecbf44facdc52553f91f4d7c52a5cd34e0401ec64b85a20c5c975c054f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Temple", image: "https://mediumrare.imgix.net/d663666695dd89f889506c445793aa8a55af8d79c534d82e200d18525f6b0e5b?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Tiger Gems", image: "https://mediumrare.imgix.net/819a3b214aaa54ba07b3b3da8bcb6f71549d01baf388d5f826a31fb743388bf1?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Sun", image: "https://mediumrare.imgix.net/0fac23ed8fece3e090f516e8b1cc73a4bcc504e2d59dfda6dad1476a62f4d879?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Dragon Wealth", image: "https://mediumrare.imgix.net/0c7fa15af4e211b91f80945e18fae6297f44d86782b8c7c23f7d7c38fae3a587?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hit More Gold", image: "https://mediumrare.imgix.net/15b2c1465156598cfbf4f8c4e039f81a1cd49984358663ff4e67174b75900315?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Big Heist", image: "https://mediumrare.imgix.net/d776ed24ec3472f63f8527bc074d02a7f4b08b512a3833b3593f1ae6c0a23723?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Pearl Diver 2", image: "https://mediumrare.imgix.net/7dde31ccc03a7d68514d9da0c79ece137df6e21bd701f8295d56dfaac7f8f95f?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Moon Sisters", image: "https://mediumrare.imgix.net/c2c2fe9d13508344796c41b0bbfec9f1def07745c248eaaab3949d895acd7815?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "China Festival", image: "https://mediumrare.imgix.net/abbaea8b14c8887d40dfb4b8adef86a8009265cd146fa87dd869e62468ed44d4?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Crystal Scarabs", image: "https://mediumrare.imgix.net/05f51912bf4f9a9d8979dc2c7c879ceec9430489c88b12a0ab5b4ee8b86e4188?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Dragon Pearls", image: "https://mediumrare.imgix.net/d8cc824c6c095f5d3f7cda2113d5044a079538667cd9b3ee284254329041c768?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Eggs Of Gold", image: "https://mediumrare.imgix.net/0debc0f807210f01e6cb67c86ca062966c3932804f5a35319b0353e8701779b8?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Book of Sun Multichance", image: "https://mediumrare.imgix.net/d43eddf41b3becc18d7b94559746f8d91993ec7197c407eba3d30551fb6d6c21?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Little Farm", image: "https://mediumrare.imgix.net/fd702ebd03c58ca2e6fd344c30247f3ce43a5a87c5a9b597cfe0c2bf92d1b0ef?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt 2", image: "https://mediumrare.imgix.net/8825caf4e011a82f6b4ab7cde9653e854eefa7e33d273e0f23ad22bfd898d3da?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hit the Gold", image: "https://mediumrare.imgix.net/0a8b1b5b9f9b778d429bdfaa238c65877b7a6c18f0eec8a638f10c3286e88fb5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Tiger Jungle", image: "https://mediumrare.imgix.net/b2fa6c7e82f5c2839436b653b91a270836ec777584e8df16acbc3101ef83222c?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Magic Apple hold and win", image: "https://mediumrare.imgix.net/a22a2f6e8c6ab471b63360ded16bb0b0424efa6b702c37a52f93363fd527c116?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Riches", image: "https://mediumrare.imgix.net/4d61f0b7ee09f07432685182a6c7c9e00e41d36e47b6c46d409e966f4363e8fe?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Green Chilli", image: "https://mediumrare.imgix.net/b837d588cb4a8199572f6f827f0632952eeb4f39c134e0843975ee6ed0239c6a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Grab More Gold", image: "https://mediumrare.imgix.net/d364aede7b248334cfb8dbdf67de6f2d54b4e19136db12d343862eeb40d4072e?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Queen of the Sun", image: "https://mediumrare.imgix.net/38314d61a8304e913837db18fd4780f33c1014ceaebe632be731200b15c3ccd4?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Lord of Fortune 2", image: "https://mediumrare.imgix.net/d56c8a88317c63b1bc12e1fe80fdbd4bda26a3d22d77ab564c97ded8e0d18481?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Grab The Gold", image: "https://mediumrare.imgix.net/52831c048112281517141ce57469d30273fd054277f25c18e6248831f26b9124?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Thunder of Olympus", image: "https://mediumrare.imgix.net/724ab9940c8982543f86a8302267fab8a28e98639a53553525c9fd6148d991f9?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Olympian Gods", image: "https://mediumrare.imgix.net/e59fdc1189227290ecd326337237a4b620100869c23b181178326a51b2a19fcf?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Scarab Boost", image: "https://mediumrare.imgix.net/c07923607eafd12e0b85a2857383ce206269d675f6632133d6d514d431482ea1?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Hawaii Riches", image: "https://mediumrare.imgix.net/0962cd59b027d298c6bf47ffa478213fd01b417eb23d639b017c74b182153a90?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Maya Sun", image: "https://mediumrare.imgix.net/be4bc87e518f6b853ce51041d5859f895b15d84db6e318c576906fb9a348f84a?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Rio Gems", image: "https://mediumrare.imgix.net/a942741a93e50087501324c66e5fb14bbe6148ea7f9e74f3a79df311f504a138?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sunlight Princess", image: "https://mediumrare.imgix.net/9b6f42ca523917040493a9c87ac11140365dea736c23ec13913d8823cfeab920?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Sun of Egypt", image: "https://mediumrare.imgix.net/f480d50fed347d852024d7f19033e86ba083bcf747fac31eb4f9a67ae981a8c2?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },
  { name: "Magic Apple2", image: "https://mediumrare.imgix.net/4005c84b0b69377b8e2c82f5d88c081abd84dffe35b7f07d13cff1bbcb8ca3f5?w=360&h=472&fit=min&auto=format", provider: "3Oaks" },   
   { name: "Book of Eye", image: "https://cdn.oscarstatic.com/images/game/uploads/softswiss.onlyplay-BookofEye_designed.jpg", provider: "Only Play " }
    ];
    let slots = [];
    const slotSearch = document.getElementById('slotSearch');
    const slotBet = document.getElementById('slotBet');
    const addSlotBtn = document.getElementById('addSlotBtn');
    const slotSuggestions = document.getElementById('slotSuggestions');
    const totalBonuses = document.getElementById('totalBonuses');
    const huntSlotList = document.getElementById('huntSlotList');
    const toggleEditSlotsBtn = document.getElementById('toggleEditSlotsBtn');
    const startMoney = document.getElementById('startMoney');
    const finishMoney = document.getElementById('finishMoney');
    const superCheckbox = document.getElementById('superCheckbox');
    const slotImageUrl = document.getElementById('slotImageUrl');
    const discordBannerUrl = document.getElementById('discordBannerUrl');
    const setDiscordBannerBtn = document.getElementById('setDiscordBannerBtn');
    const sidebarBannerImageContainer = document.getElementById('sidebarBannerImageContainer');
    const sidebarBannerImage = document.getElementById('sidebarBannerImage');
    const showSlotUrlBtn = document.getElementById('showSlotUrlBtn');

    showSlotUrlBtn.addEventListener('click', function() {
      slotImageUrl.style.display = slotImageUrl.style.display === 'none' ? 'block' : 'none';
      if (slotImageUrl.style.display === 'block') slotImageUrl.focus();
    });

    // Hide slotImageUrl input after use
    slotImageUrl.addEventListener('blur', function() {
      slotImageUrl.style.display = 'none';
    });
    slotImageUrl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') slotImageUrl.blur();
    });

    // --- Sidebar Stats Logic ---
    function updateSidebarStats() {
      const sidebarAvg = document.getElementById('sidebarAvg');
      const sidebarBE = document.getElementById('sidebarBE');
      const sidebarProfit = document.getElementById('sidebarProfit');
      const sidebarTarget = document.getElementById('sidebarTarget');
      const sidebarProgressBar = document.getElementById('sidebarProgressBar');
      const sidebarProgressText = document.getElementById('sidebarProgressText');
      const start = parseFloat(startMoney.value) || 0;
      const finish = parseFloat(finishMoney.value) || 0;
      const totalBet = slots.reduce((acc, s) => acc + (s.bet || 0), 0);
      let be = totalBet > 0 ? start / totalBet : 0;
      sidebarBE.textContent = be ? be.toFixed(2) + "x" : "0x";
      let avg = totalBet > 0 ? finish / totalBet : 0;
      sidebarAvg.textContent = avg ? avg.toFixed(2) + "x" : "0x";
      let profit = finish - start;
      sidebarProfit.textContent = profit.toFixed(2) + "€";
      sidebarProfit.style.color = profit > 0 ? "#3ec6ff" : (profit < 0 ? "#ff3e3e" : "#fff");
      sidebarTarget.textContent = start.toFixed(2) + "€";
      let progress = be > 0 ? Math.min((avg / be) * 100, 100) : 0;
      sidebarProgressBar.style.width = progress + "%";
      sidebarProgressText.textContent = progress ? progress.toFixed(0) + "%" : "0%";
    }
    function updateProfit() {
      // Dummy function for compatibility
    }
    startMoney.addEventListener('input', function() {
      updateProfit();
      updateSidebarStats();
    });
    finishMoney.addEventListener('input', function() {
      updateProfit();
      updateSidebarStats();
    });

    // Show suggestions as you type
    slotSearch.addEventListener('input', function() {
      const query = slotSearch.value.trim().toLowerCase();
      slotSuggestions.innerHTML = '';
      if (query.length >= 3) {
        const matches = slotDatabase.filter(slot => slot.name.toLowerCase().includes(query));
        if (matches.length) {
          slotSuggestions.style.display = 'block';
          matches.forEach(slot => {
            const div = document.createElement('div');
            div.className = 'slot-suggestion-item';
            div.innerHTML = `
              <img src="${slot.image}" alt="${slot.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;">
              <span style="font-weight:bold;">${slot.name}</span>
              <span style="font-size:0.9em;color:#7ec6ff;margin-left:6px;">${slot.provider || ''}</span>
            `;
            div.addEventListener('mousedown', function(e) {
              slotSearch.value = slot.name;
              slotSuggestions.style.display = 'none';
            });
            slotSuggestions.appendChild(div);
          });
        } else {
          slotSuggestions.style.display = 'none';
        }
      } else {
        slotSuggestions.style.display = 'none';
      }
    });
    slotSearch.addEventListener('blur', function() {
      setTimeout(() => slotSuggestions.style.display = 'none', 100);
    });
    addSlotBtn.addEventListener('click', function() {
      const name = slotSearch.value.trim();
      const bet = parseFloat(slotBet.value);
      const isSuper = superCheckbox.checked;
      const customImage = slotImageUrl.value.trim();
      if (!name || isNaN(bet) || bet <= 0) {
        slotSearch.style.boxShadow = "0 0 0 2px #ff3e3e";
        slotBet.style.boxShadow = "0 0 0 2px #ff3e3e";
        setTimeout(() => {
          slotSearch.style.boxShadow = "";
          slotBet.style.boxShadow = "";
        }, 600);
        return;
      }
      const slotObj = slotDatabase.find(slot => slot.name === name);
      slots.push({
        name,
        bet,
        image: customImage || (slotObj ? slotObj.image : ''),
        provider: slotObj ? slotObj.provider : '',
        super: isSuper
      });
      slotSearch.value = "";
      slotBet.value = "";
      slotImageUrl.value = "";
      superCheckbox.checked = false;
      carouselIndex = 0;
      updateBonusList();
    });
    toggleEditSlotsBtn.addEventListener('click', function() {
      if (huntSlotList.style.display === 'none' || huntSlotList.style.display === '') {
        huntSlotList.style.display = 'flex';
        toggleEditSlotsBtn.textContent = 'Hide Edit Slots';
      } else {
        huntSlotList.style.display = 'none';
        toggleEditSlotsBtn.textContent = 'Edit Slots';
      }
    });

    // --- Carousel rotation logic ---
    function startCarouselRotation() {
      if (carouselInterval) clearInterval(carouselInterval);
      carouselInterval = setInterval(() => {
        if (slots.length > 0) {
          animateCarouselToIndex((carouselIndex + 1) % slots.length);
        }
      }, 2500);
    }

    // --- Smooth carousel animation ---
    let isCarouselAnimating = false;
    function animateCarouselToIndex(newIndex) {
      if (isCarouselAnimating || newIndex === carouselIndex) return;
      const bonus3dCarousel = document.getElementById('bonus3dCarousel');
      const track = bonus3dCarousel.querySelector('.card-3d-track');
      if (!track) {
        carouselIndex = newIndex;
        updateBonusList(false);
        return;
      }
      isCarouselAnimating = true;
      const slotWidth = 120;
      const gap = 0;
      const containerWidth = 360;
      const currentOffset = (containerWidth / 2) - (slotWidth / 2) - (carouselIndex * (slotWidth + gap));
      const nextOffset = (containerWidth / 2) - (slotWidth / 2) - (newIndex * (slotWidth + gap));
      track.style.transition = 'transform 0.7s cubic-bezier(.22,1,.36,1)';
      track.style.transform = `translateX(${nextOffset}px)`;
      setTimeout(() => {
        carouselIndex = newIndex;
        updateBonusList(false); // re-render to update active class
        isCarouselAnimating = false;
      }, 700);
    }

    // --- Update both sidebar and hunt control panel slot list ---
    function updateBonusList(restartInterval = true) {
      // 3D Carousel for Bonus List
      const bonus3dCarousel = document.getElementById('bonus3dCarousel');
      bonus3dCarousel.innerHTML = '';
      const n = slots.length;
      const visibleSlots = 3; // always show 3 (centered)
      const slotWidth = 120;
      const gap = 0;
      const track = document.createElement('div');
      track.className = 'card-3d-track';
      track.style.width = `${n * slotWidth}px`;

      if (n > 0) {
        for (let i = 0; i < n; i++) {
          const slot = slots[i];
          const div = document.createElement('div');
          div.className = 'card-3d-slot' + (i === carouselIndex ? ' active' : '');
          div.innerHTML = `
            <img class="card-3d-img${slot.super ? ' super-glow' : ''}" src="${slot.image}" alt="${slot.name}">
            <div class="card-3d-bet${slot.super ? ' super-vibrate' : ''}">€${slot.bet.toFixed(2)}</div>
          `;
          div.title = slot.name;
          track.appendChild(div);
        }
        // Center the active card
        const containerWidth = 360; // .card-3d width
        const offset = (containerWidth / 2) - (slotWidth / 2) - (carouselIndex * (slotWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        track.style.transition = isCarouselAnimating ? 'transform 0.7s cubic-bezier(.22,1,.36,1)' : '';
      } else {
        for (let i = 0; i < 3; i++) {
          const div = document.createElement('div');
          div.className = 'card-3d-slot';
          div.style.background = '#232b3e';
          div.style.border = '2px dashed #3ec6ff22';
          track.appendChild(div);
        }
        track.style.transform = `translateX(0px)`;
      }
      bonus3dCarousel.appendChild(track);

      // Best & Worst Slot logic
      const bestSlotDiv = document.getElementById('sidebarBestSlot');
      const worstSlotDiv = document.getElementById('sidebarWorstSlot');
      let best = null, worst = null;
      slots.forEach(slot => {
        if (typeof slot.paid === "number" && slot.bet > 0) {
          const x = slot.paid / slot.bet;
          if (!best || x > best.x) best = { ...slot, x };
          if (!worst || x < worst.x) worst = { ...slot, x };
        }
      });

      // NEW slotBoxHTML: no name, bigger image, pills for bet, paid, x
      function slotBoxHTML(slot, label, cardClass) {
        return `
          <div class="${cardClass}" style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <div class="slot-img-wrapper">
              <div class="slot-pills-top">
                <span class="slot-bet-pill">€${slot.bet.toFixed(2)}</span>
                <span class="slot-x-pill">${slot.x?.toFixed(2) ?? "0.00"}x</span>
              </div>
              <img class="slot-img" src="${slot.image}" alt="">
              <span class="slot-paid-pill">€${slot.paid !== undefined ? Number(slot.paid).toFixed(2) : "0.00"}</span>
            </div>
            <div class="slot-label" style="margin-top:8px;">${label}</div>
          </div>
        `;
      }

      bestSlotDiv.innerHTML = best ? slotBoxHTML(best, "Best", "slot-best-card") : '<span style="color:#aaa;">No data</span>';
      worstSlotDiv.innerHTML = worst ? slotBoxHTML(worst, "Worst", "slot-worst-card") : '<span style="color:#aaa;">No data</span>';

      // Hunt control panel list (single row)
      huntSlotList.innerHTML = '';
      slots.forEach((slot, idx) => {
        const row = document.createElement('div');
        row.className = 'hunt-slot-row';
        row.innerHTML = `
          <span style="flex:1;">${slot.name} (€${slot.bet.toFixed(2)})</span>
          <button class="edit-slot-btn" title="Edit">✏️</button>
          <button class="delete-slot-btn" title="Delete">🗑️</button>
        `;
        row.querySelector('.edit-slot-btn').onclick = function() {
          const newName = prompt("Edit slot name:", slot.name);
          if (newName !== null && newName.trim() !== "") slot.name = newName.trim();
          const newBet = prompt("Edit bet (€):", slot.bet);
          if (newBet !== null && !isNaN(parseFloat(newBet))) slot.bet = parseFloat(newBet);
          updateBonusList();
        };
        row.querySelector('.delete-slot-btn').onclick = function() {
          if (confirm("Remove this slot?")) {
            slots.splice(idx, 1);
            carouselIndex = 0; // Reset carousel to start
            updateBonusList();
          }
        };
        huntSlotList.appendChild(row);
      });
      totalBonuses.textContent = slots.length + " Bonuses";
      updateSidebarStats();
      if (restartInterval) startCarouselRotation();
    }

    slotSearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addSlotBtn.click();
    });
    slotBet && slotBet.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addSlotBtn.click();
    });

    // --- Slot Opener Logic ---
    const finishHuntBtn = document.getElementById('finishHuntBtn');
    const slotOpenerPanel = document.getElementById('slotOpenerPanel');
    const slotOpenerSlotInfo = document.getElementById('slotOpenerSlotInfo');
    const slotOpenerPayInput = document.getElementById('slotOpenerPayInput');
    const slotOpenerNextBtn = document.getElementById('slotOpenerNextBtn');
    const slotOpenerProgress = document.getElementById('slotOpenerProgress');
    let slotOpenIndex = 0;

    // --- FIX: Hide slot opener panel on page load ---
    slotOpenerPanel.style.display = "none";
    // Also ensure huntControls is defined
    const huntControls = document.getElementById('bonus-hunt-controls');

    finishHuntBtn.addEventListener('click', function() {
      if (slots.length === 0) {
        alert("No slots to open!");
        return;
      }
      huntControls.classList.add('hide');
      slotOpenerPanel.style.display = "block";
      slotOpenIndex = 0;
      slots.forEach(s => delete s.paid); // Reset paid values
      showSlotOpener();
    });

    function showSlotOpener() {
      if (slotOpenIndex >= slots.length) {
        slotOpenerPanel.style.display = "none";
        huntControls.classList.remove('hide'); // Show controls again
        updateSidebarStats();
        updateBonusList();
        return;
      }
      const slot = slots[slotOpenIndex];
      const paid = slot.paid !== undefined ? slot.paid : "";
      const x = (slot.paid && slot.bet) ? (slot.paid / slot.bet) : 0;
      slotOpenerSlotInfo.innerHTML = `
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span class="slot-bet-pill">€${slot.bet.toFixed(2)}</span>
          <span class="slot-paid-pill">Paid: €${paid !== "" ? Number(paid).toFixed(2) : "0.00"}</span>
          <span class="slot-x-pill">${x ? x.toFixed(2) : "0.00"}x</span>
          <img src="${slot.image}" alt="${slot.name}" class="slot-img" style="width:500px;height:500px;object-fit:contain;display:block;">
        </div>
        <div style="margin-top:8px;color:#3ec6ff;font-size:1.2em;font-weight:bold;">${slot.name}</div>
        <div style="color:#7ec6ff;font-size:1em;">${slot.provider || ""}</div>
      `;
      slotOpenerPayInput.value = paid;
      slotOpenerPayInput.focus();
      slotOpenerProgress.textContent = `Slot ${slotOpenIndex + 1} of ${slots.length}`;
    }

    // Only add these listeners ONCE!
    slotOpenerNextBtn.addEventListener('click', function() {
      const val = parseFloat(slotOpenerPayInput.value);
      if (isNaN(val) || val < 0) {
        slotOpenerPayInput.style.boxShadow = "0 0 0 2px #ff3e3e";
        setTimeout(() => slotOpenerPayInput.style.boxShadow = "", 600);
        return;
      }
      slots[slotOpenIndex].paid = val;
      slotOpenIndex++;
      const paidSum = slots.reduce((acc, s) => acc + (s.paid || 0), 0);
      finishMoney.value = paidSum.toFixed(2);
      updateProfit();
      updateSidebarStats();
      updateBonusList();
      showSlotOpener();
    });
    slotOpenerPayInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') slotOpenerNextBtn.click();
    });

    // Discord Banner logic (FIXED)
    setDiscordBannerBtn.addEventListener('click', function() {
      // Toggle input visibility
      if (discordBannerUrl.style.display === 'none' || !discordBannerUrl.style.display) {
        discordBannerUrl.style.display = 'block';
        discordBannerUrl.focus();
        return;
      }
      // If input is visible, set the banner
      const url = discordBannerUrl.value.trim();
      if (url) {
        sidebarBannerImage.src = url;
        sidebarBannerImageContainer.style.display = "block";
      } else {
        sidebarBannerImage.src = "";
        sidebarBannerImageContainer.style.display = "none";
      }
      discordBannerUrl.style.display = 'none';
    });

    // --- Tournament Bracket & Setup Logic ---
    // Only declare each variable ONCE!
    const peopleArrowsIcon = document.querySelector('.fa-people-arrows');
    const tournamentBracketPanel = document.getElementById('tournamentBracketPanel');
    const quarterMatchesDiv = document.getElementById('quarterMatches');
    const semiMatchesDiv = document.getElementById('semiMatches');
    const finalMatchDiv = document.getElementById('finalMatch');
    const tournamentSetupPanel = document.getElementById('tournamentSetupPanel');
    const tournamentSetupRows = document.getElementById('tournamentSetupRows');
    const startTournamentBtn = document.getElementById('startTournamentBtn');
    const openMatchControlBtn = document.getElementById('openMatchControlBtn');
    const tournamentMatchControl = document.getElementById('tournamentMatchControl');
    const matchControlPlayers = document.getElementById('matchControlPlayers');
    const matchControlBtn1 = document.getElementById('matchControlBtn1');
    const matchControlBtn2 = document.getElementById('matchControlBtn2');
    const matchControlPhase = document.getElementById('matchControlPhase');
    const closeMatchControlBtn = document.getElementById('closeMatchControlBtn');

    (function() {
      const panel = document.getElementById('tournamentMatchControl');
      const handle = document.getElementById('matchControlDragHandle');
      let offsetX = 0, offsetY = 0, isDragging = false;

      handle.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.transform = 'none';
        panel.style.position = 'fixed';
      });

      document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
      });
    })();
    
    // Helper to get current phase and match index
    function getCurrentMatch() {
      if (!isPhaseComplete(bracket.quarters)) {
        // Find first incomplete quarter match
        const idx = bracket.quarters.findIndex(m => m.winner === null);
        return { phase: 'quarters', idx, match: bracket.quarters[idx] };
      } else if (!isPhaseComplete(bracket.semis)) {
        const idx = bracket.semis.findIndex(m => m.winner === null);
        return { phase: 'semis', idx, match: bracket.semis[idx] };
      } else {
        return { phase: 'final', idx: 0, match: bracket.final };
      }
    }

    openMatchControlBtn.addEventListener('click', function() {
      const { phase, idx, match } = getCurrentMatch();
      if (!match) {
        alert("No match to control!");
        return;
      }
      tournamentMatchControl.style.display = 'block';
      // Get player names
      const p1Name = tournamentPlayers[match.p1]?.name || '';
      const p2Name = tournamentPlayers[match.p2]?.name || '';
      matchControlPlayers.textContent = `${p1Name} vs ${p2Name}`;
      matchControlBtn1.textContent = `${p1Name} +1`;
      matchControlBtn2.textContent = `${p2Name} +1`;
      matchControlPhase.textContent = `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}${phase !== 'final' ? ' Match ' + (idx + 1) : ''}`;
      // Store for click handlers
      matchControlBtn1.onclick = function() {
        window.updateScore(phase, idx, 1);
        openMatchControlBtn.click(); // Refresh panel
      };
      matchControlBtn2.onclick = function() {
        window.updateScore(phase, idx, 2);
        openMatchControlBtn.click(); // Refresh panel
      };
    });

    // Close button
    closeMatchControlBtn.addEventListener('click', function() {
      tournamentMatchControl.style.display = 'none';
    });

    // Tournament players for setup (editable)
    let tournamentPlayers = [
      { name: "Player 1", slot: "" },
      { name: "Player 2", slot: "" },
      { name: "Player 3", slot: "" },
      { name: "Player 4", slot: "" },
      { name: "Player 5", slot: "" },
      { name: "Player 6", slot: "" },
      { name: "Player 7", slot: "" },
      { name: "Player 8", slot: "" }
    ];

    // Tournament state
    let bracket = {
      quarters: [
        {p1: 0, p2: 1, score1: 0, score2: 0, winner: null},
        {p1: 2, p2: 3, score1: 0, score2: 0, winner: null},
        {p1: 4, p2: 5, score1: 0, score2: 0, winner: null},
        {p1: 6, p2: 7, score1: 0, score2: 0, winner: null}
      ],
      semis: [
        {p1: null, p2: null, score1: 0, score2: 0, winner: null},
        {p1: null, p2: null, score1: 0, score2: 0, winner: null}
      ],
      final: {p1: null, p2: null, score1: 0, score2: 0, winner: null}
    };

    // Helper for bracket display names
    function getBracketPlayerName(idx) {
      if (window.tournamentPlayers && window.tournamentPlayers[idx]) return window.tournamentPlayers[idx];
      if (tournamentPlayers[idx]) {
        let p = tournamentPlayers[idx];
        return p.name + (p.slot ? " (" + p.slot + ")" : "");
      }
      return "Player " + (idx + 1);
    }

    // Get slot data by name
    function getSlotData(slotName) {
      return slotDatabase.find(s => s.name === slotName) || {};
    }

    // Bracket slot card HTML
    function bracketSlotCard(playerName, slotName) {
      const slot = getSlotData(slotName);
      return `
        <div style="
          background: #181926;
          border-radius: 12px;
          box-shadow: 0 0 18px #3ec6ff88;
          padding: 0;
          margin: 8px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 120px;
          max-width: 140px;
          border: 2px solid #3ec6ff;
          overflow: hidden;
          height: 140px;
          position: relative;
          ">
          <img src="${slot.image || 'https://via.placeholder.com/140x140/232b3e/3ec6ff?text=?'}"
               alt=""
               style="width:100%;height:100%;object-fit:cover;display:block;">
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(24,25,38,0.85);
            color: #3ec6ff;
            font-weight: bold;
            text-align: center;
            font-size: 1em;
            padding: 2px 0 0 0;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          ">${playerName || '?'}<br><span style="font-size:0.9em;color:#7ec6ff;">${slotName || ''}</span></div>
        </div>
      `;
    }

    // Render bracket
    function renderBracket() {
      // Helper to get highlight class
      function getHighlightClass(match, side) {
        if (match.winner === null) return '';
        if (side === 1 && match.winner === match.p1) return 'bracket-winner';
        if (side === 2 && match.winner === match.p2) return 'bracket-winner';
        if (side === 1 && match.winner === match.p2) return 'bracket-loser';
        if (side === 2 && match.winner === match.p1) return 'bracket-loser';
        return '';
      }

      // Hide all phases by default
      quarterMatchesDiv.parentElement.style.display = 'none';
      semiMatchesDiv.parentElement.style.display = 'none';
      finalMatchDiv.parentElement.style.display = 'none';

      // Quarters
      if (!isPhaseComplete(bracket.quarters)) {
        quarterMatchesDiv.parentElement.style.display = '';
        quarterMatchesDiv.innerHTML = '';
        bracket.quarters.forEach((m, i) => {
          const p1Name = tournamentPlayers[m.p1]?.name || '';
          const p1Slot = tournamentPlayers[m.p1]?.slot || '';
          const p2Name = tournamentPlayers[m.p2]?.name || '';
          const p2Slot = tournamentPlayers[m.p2]?.slot || '';
          quarterMatchesDiv.innerHTML += `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
              <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
              <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
              <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
            </div>
          `;
        });
      } else if (!isPhaseComplete(bracket.semis)) {
        semiMatchesDiv.parentElement.style.display = '';
        semiMatchesDiv.innerHTML = '';
        bracket.semis.forEach((m, i) => {
          const p1Name = tournamentPlayers[m.p1]?.name || '';
          const p1Slot = tournamentPlayers[m.p1]?.slot || '';
          const p2Name = tournamentPlayers[m.p2]?.name || '';
          const p2Slot = tournamentPlayers[m.p2]?.slot || '';
          semiMatchesDiv.innerHTML += `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
              <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
              <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
              <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
            </div>
          `;
        });
      } else {
        finalMatchDiv.parentElement.style.display = '';
        finalMatchDiv.innerHTML = '';
        const m = bracket.final;
        const p1Name = tournamentPlayers[m.p1]?.name || '';
        const p1Slot = tournamentPlayers[m.p1]?.slot || '';
        const p2Name = tournamentPlayers[m.p2]?.name || '';
        const p2Slot = tournamentPlayers[m.p2]?.slot || '';
        finalMatchDiv.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
            <div class="${getHighlightClass(m, 1)}">${bracketSlotCard(p1Name, p1Slot)}</div>
            <span style="color:#3ec6ff;font-size:1.4em;font-family:'Orbitron',monospace;">VS</span>
            <div class="${getHighlightClass(m, 2)}">${bracketSlotCard(p2Name, p2Slot)}</div>
          </div>
        `;
      }

      // Add event listeners for score inputs if needed
      setTimeout(() => {
        document.querySelectorAll('.bracket-score-input').forEach(input => {
          input.addEventListener('change', function() {
            const matchIdx = +this.dataset.match;
            const side = +this.dataset.side;
            const val = Math.max(0, parseInt(this.value) || 0);
            if (!isPhaseComplete(bracket.quarters)) {
              if (side === 1) bracket.quarters[matchIdx].score1 = val;
              if (side === 2) bracket.quarters[matchIdx].score2 = val;
            } else if (!isPhaseComplete(bracket.semis)) {
              if (side === 1) bracket.semis[matchIdx].score1 = val;
              if (side === 2) bracket.semis[matchIdx].score2 = val;
            } else {
              if (side === 1) bracket.final.score1 = val;
              if (side === 2) bracket.final.score2 = val;
            }
            renderBracket();
          });
        });
      }, 0);
    }

    // Score update logic (best of 3)
    window.updateScore = function(round, idx, player) {
      let match;
      if (round === 'quarters') match = bracket.quarters[idx];
      if (round === 'semis') match = bracket.semis[idx];
      if (round === 'final') match = bracket.final;
      if (!match) return;
      if (player === 1) match.score1++;
      if (player === 2) match.score2++;
      // Best of 3 logic
      if (match.score1 === 2) {
        match.winner = match.p1;
        match.score1 = 2; match.score2 = Math.min(match.score2, 1);
      }
      if (match.score2 === 2) {
        match.winner = match.p2;
        match.score2 = 2; match.score1 = Math.min(match.score1, 1);
      }
      // Advance winners
      if (round === 'quarters') {
        bracket.semis[Math.floor(idx/2)][idx%2 === 0 ? 'p1' : 'p2'] = match.winner;
      }
      if (round === 'semis') {
        bracket.final[idx === 0 ? 'p1' : 'p2'] = match.winner;
      }
      renderBracket();
    };

    // Tournament setup panel rendering
    function renderTournamentSetup() {
      tournamentSetupRows.innerHTML = "";
      tournamentPlayers.forEach((player, i) => {
        tournamentSetupRows.innerHTML += `
          <tr>
            <td style="color:#3ec6ff;font-family:'Orbitron',monospace;">${i+1}</td>
            <td>
              <input class="tournament-player-input" id="playerNameInput${i}" value="${player.name}" autocomplete="off">
            </td>
            <td style="position:relative;">
              <input class="tournament-slot-input" id="playerSlotInput${i}" value="${player.slot}" placeholder="Search slot..." autocomplete="off">
              <div class="tournament-slot-suggestions" id="slotSuggestions${i}" style="display:none;"></div>
            </td>
          </tr>
        `;
      });

      // Add listeners for name and slot search
      tournamentPlayers.forEach((player, i) => {
        const nameInput = document.getElementById(`playerNameInput${i}`);
        nameInput.addEventListener('input', e => {
          tournamentPlayers[i].name = nameInput.value;
        });

        const slotInput = document.getElementById(`playerSlotInput${i}`);
        const suggestionsDiv = document.getElementById(`slotSuggestions${i}`);
        slotInput.addEventListener('input', function() {
          const query = slotInput.value.trim().toLowerCase();
          suggestionsDiv.innerHTML = '';
          if (query.length >= 2) {
            const matches = slotDatabase.filter(slot => slot.name.toLowerCase().includes(query));
            if (matches.length) {
              suggestionsDiv.style.display = 'block';
              matches.forEach(slot => {
                const div = document.createElement('div');
                div.className = 'tournament-slot-suggestion-item';
                div.innerHTML = `<img src="${slot.image}" alt="${slot.name}" style="width:28px;height:28px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;">
                  <span style="font-weight:bold;">${slot.name}</span>
                  <span style="font-size:0.9em;color:#7ec6ff;margin-left:6px;">${slot.provider || ''}</span>`;
                div.addEventListener('mousedown', function(e) {
                  slotInput.value = slot.name;
                  tournamentPlayers[i].slot = slot.name;
                  suggestionsDiv.style.display = 'none';
                });
                suggestionsDiv.appendChild(div);
              });
            } else {
              suggestionsDiv.style.display = 'none';
            }
          } else {
            suggestionsDiv.style.display = 'none';
          }
        });
        slotInput.addEventListener('blur', function() {
          setTimeout(() => suggestionsDiv.style.display = 'none', 100);
        });
        slotInput.addEventListener('input', function() {
          tournamentPlayers[i].slot = slotInput.value;
        });
      });
    }

    // Show setup panel when clicking people arrows
    peopleArrowsIcon.addEventListener('click', function() {
      // If setup panel is open, close it and slide bracket out to the left
      if (tournamentSetupPanel.style.display === 'block') {
        tournamentSetupPanel.style.display = 'none';
        if (tournamentBracketPanel.classList.contains('slide-in-right')) {
          tournamentBracketPanel.classList.remove('slide-in-right');
          tournamentBracketPanel.classList.remove('slide-out-right');
          tournamentBracketPanel.classList.add('slide-out-left');
          setTimeout(() => {
            tournamentBracketPanel.style.display = 'none';
            tournamentBracketPanel.classList.remove('slide-out-left');
          }, 700);
        } else {
          tournamentBracketPanel.style.display = 'none';
        }
      } else {
        renderTournamentSetup();
        tournamentSetupPanel.style.display = 'block';
        // If bracket is visible, slide it out to the left
        if (tournamentBracketPanel.classList.contains('slide-in-right')) {
          tournamentBracketPanel.classList.remove('slide-in-right');
          tournamentBracketPanel.classList.remove('slide-out-right');
          tournamentBracketPanel.classList.add('slide-out-left');
          setTimeout(() => {
            tournamentBracketPanel.style.display = 'none';
            tournamentBracketPanel.classList.remove('slide-out-left');
          }, 700);
        } else {
          tournamentBracketPanel.style.display = 'none';
        }
      }
    });

    // When starting the tournament, animate bracket in from right
    startTournamentBtn.addEventListener('click', function() {
      for (let p of tournamentPlayers) {
        if (!p.name.trim() || !p.slot.trim()) {
          alert("Please fill all player names and slots!");
          return;
        }
      }
      tournamentSetupPanel.style.display = 'none';
      tournamentBracketPanel.style.display = 'block';
      tournamentBracketPanel.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right');
      void tournamentBracketPanel.offsetWidth;
      tournamentBracketPanel.classList.add('slide-in-right');
      renderBracket();
    });

    // Helper: Check if phase is complete
    function isPhaseComplete(phase) {
      if (Array.isArray(phase)) {
        return phase.every(m => m.winner !== null);
      } else if (typeof phase === "object") {
        return phase.winner !== null;
      }
      return false;
    }

    // --- Floating Slot Picker Card Logic ---
const floatingSlotPickerCard = document.getElementById('floatingSlotPickerCard');
const floatingSlotPickerSpinner = document.getElementById('floatingSlotPickerSpinner');
const cartIcon = document.querySelector('.fa-cart-shopping');
let spinTimeout = null;

function showFloatingSlotPicker(show = true) {
  floatingSlotPickerCard.style.display = show ? 'block' : 'none';
}

// Unified spin animation for both modal and floating card
function unifiedSpinAnimation(slots, onDone) {
  showFloatingSlotPicker(true);
  let idx = Math.floor(Math.random() * slots.length);
  let speed = 35;
  let spins = 0;
  let maxSpins = 16 + Math.floor(Math.random() * 6);
  function showSlot(i, isFinal = false) {
    const slot = slots[i];
    // Floating card
    floatingSlotPickerSpinner.innerHTML = isFinal
      ? `<div class=\"floating-slot-glow\"><img src=\"${slot.image}\" alt=\"\"></div>`
      : `<div class=\"floating-slot-spinning\"><img src=\"${slot.image}\" alt=\"\"></div>`;
    // Modal
    slotPickerSpinner.innerHTML = isFinal
      ? `<div class=\"slot-picker-glow\" style=\"display:flex;flex-direction:column;align-items:center;\">\n          <img src=\"${slot.image}\" alt=\"${slot.name}\" style=\"width:120px;height:140px;object-fit:cover;border-radius:12px;box-shadow:0 0 32px 8px #3ec6ffcc,0 0 0 4px #3ec6ff44;outline:3px solid #3ec6ff;outline-offset:2px;\">\n          <div style=\"color:#3ec6ff;font-weight:bold;font-size:1.1em;margin-top:8px;letter-spacing:1px;text-shadow:0 2px 8px #0008;\">${slot.name}</div>\n          <div style=\"color:#7ec6ff;font-size:0.95em;\">${slot.provider}</div>\n        </div>`
      : `<div class=\"slot-picker-spinning\" style=\"display:flex;flex-direction:column;align-items:center;\">\n        <img src=\"${slot.image}\" alt=\"${slot.name}\" style=\"width:120px;height:140px;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px #3ec6ff88;\">\n        <div style=\"color:#3ec6ff;font-weight:bold;font-size:1.1em;margin-top:8px;letter-spacing:1px;text-shadow:0 2px 8px #0008;\">${slot.name}</div>\n        <div style=\"color:#7ec6ff;font-size:0.95em;\">${slot.provider}</div>\n      </div>`;
  }
  function spinStep() {
    idx = (idx + 1) % slots.length;
    showSlot(idx);
    spins++;
    if (spins < maxSpins) {
      speed += 7;
      spinTimeout = setTimeout(spinStep, speed);
    } else {
      spinTimeout = null;
      showSlot(idx, true);
      slotPickerResult.style.display = 'none';
      if (onDone) onDone(slots[idx]);
    }
  }
  if (spinTimeout) clearTimeout(spinTimeout);
  spinStep();
}

function hideFloatingSlotPicker(delay = 0) {
  if (delay > 0) {
    setTimeout(() => showFloatingSlotPicker(false), delay);
  } else {
    showFloatingSlotPicker(false);
  }
}

// --- Slot Picker Modal Logic ---
document.addEventListener('DOMContentLoaded', function() {
(function() {
  // Elements
  const slotPickerModal = document.getElementById('slotPickerModal');
  const slotProviderFilters = document.getElementById('slotProviderFilters');
  const slotPickerSpinner = document.getElementById('slotPickerSpinner');
  const slotPickerResult = document.getElementById('slotPickerResult');
  const spinSlotBtn = document.getElementById('spinSlotBtn');
  const closeSlotPickerBtn = document.getElementById('closeSlotPickerBtn');

  // Get unique providers from slotDatabase
  function getProviders() {
    const providers = new Set();
    slotDatabase.forEach(slot => {
      if (slot.provider) providers.add(slot.provider.trim());
    });
    return Array.from(providers).sort();
  }

  // Render provider checkboxes
  function renderProviderFilters() {
    const providers = getProviders();
    slotProviderFilters.innerHTML = '';
    providers.forEach(provider => {
      const id = 'provider_' + provider.replace(/\W+/g, '_');
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '4px';
      label.innerHTML = `<input type="checkbox" value="${provider}" checked> <span>${provider}</span>`;
      slotProviderFilters.appendChild(label);
    });
  }

  // Get filtered slots
  function getFilteredSlots() {
    const checked = Array.from(slotProviderFilters.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    // Only include slots whose provider is checked
    return slotDatabase.filter(slot => checked.includes(slot.provider));
  }

  // Open modal
  cartIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    renderProviderFilters();
    slotPickerResult.style.display = 'none';
    slotPickerSpinner.innerHTML = '<span style="color:#7ec6ff;font-size:1.2em;">Ready to spin!</span>';
    slotPickerModal.style.display = 'block';
  });
  // Close modal
  closeSlotPickerBtn.addEventListener('click', function() {
    slotPickerModal.style.display = 'none';
  });
  // Clicking outside closes
  window.addEventListener('click', function(e) {
    if (slotPickerModal.style.display === 'block' && !slotPickerModal.contains(e.target) && !cartIcon.contains(e.target)) {
      slotPickerModal.style.display = 'none';
    }
  });

  // Animation logic
  // Replace spinAnimation with unifiedSpinAnimation
  function spinAnimation(slots, onDone) {
    unifiedSpinAnimation(slots, onDone);
  }

  // Spin button logic
  spinSlotBtn.addEventListener('click', function() {
    // Get checked providers
    const checkedProviders = Array.from(slotProviderFilters.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    if (!checkedProviders.length) {
      slotPickerSpinner.innerHTML = '<span style="color:#ff3e3e;">No providers selected!</span>';
      return;
    }
    // Pick a random provider
    const provider = checkedProviders[Math.floor(Math.random() * checkedProviders.length)];
    // Get all slots for that provider
    const providerSlots = slotDatabase.filter(slot => slot.provider === provider);
    if (!providerSlots.length) {
      slotPickerSpinner.innerHTML = `<span style=\"color:#ff3e3e;\">No slots for provider: ${provider}!</span>`;
      return;
    }
    slotPickerResult.style.display = 'none';
    spinSlotBtn.disabled = true;
    if (spinTimeout) clearTimeout(spinTimeout);
    spinAnimation(providerSlots, function(picked) {
      // Only show the picked slot in the spinner, not in the result area
      slotPickerResult.style.display = 'none';
      spinSlotBtn.disabled = false;
    });
  });

  // Re-spin if provider filter changes
  slotProviderFilters.addEventListener('change', function() {
    slotPickerResult.style.display = 'none';
    slotPickerSpinner.innerHTML = '<span style="color:#7ec6ff;font-size:1.2em;">Ready to spin!</span>';
    if (spinTimeout) clearTimeout(spinTimeout);
  });
})();
});

// Hide floating card when modal closes
closeSlotPickerBtn.addEventListener('click', function() {
    hideFloatingSlotPicker();
  });
  window.addEventListener('click', function(e) {
    if (slotPickerModal.style.display === 'block' && !slotPickerModal.contains(e.target) && !cartIcon.contains(e.target)) {
      hideFloatingSlotPicker();
    }
  });
