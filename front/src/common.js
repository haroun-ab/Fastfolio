export function setTheme() {
    // Code commun que vous souhaitez exécuter dans 
    let root = document.documentElement;

    if(localStorage.getItem('theme') == "false"){

        root.style.setProperty('--bg-primary', "#46414a");
        root.style.setProperty('--bg-secondary', "#635e68");
        root.style.setProperty('--primary', "#ffc500");
        root.style.setProperty('--secondary', "#fff");
        root.style.setProperty('--shadow', "none");
        root.style.setProperty('--text-primary', "white");
        root.style.setProperty('--border', "black");
        root.style.setProperty('--secondary-to-primary', "#6d27de");
        root.style.setProperty('--white-to-primary', "#6d27de");
        root.style.setProperty('--empty-stars', "#fff");
        document.querySelector('main').style.cssText = "background-blend-mode : color-burn !important"

    } else{
        root.style.setProperty('--bg-primary', "#fff");
        root.style.setProperty('--bg-secondary', "#f7f7f7");
        root.style.setProperty('--primary', "#6d27de");
        root.style.setProperty('--secondary', "#ffc500");
        root.style.setProperty('--shadow', "#d4d4d4");
        root.style.setProperty('--text-primary', "black");
        root.style.setProperty('--border', "#d4d4d4");
        root.style.setProperty('--secondary-to-primary', "#ffc500");
        root.style.setProperty('--white-to-primary', "white");
        root.style.setProperty('--empty-stars', "lightgrey");
        document.querySelector('main').style.cssText = "background-blend-mode : none !important"

    }
}

export async function getBackground (){
    const response = await fetch('/bg-list.json', {
     method : 'GET',
    })
    const contentResponse = await response.json();
    const bgId = localStorage.getItem('bgId');
    console.log(contentResponse[`${bgId}`]);
    document.querySelector(".user-bg").style.background = `url('/${contentResponse[`${bgId}`]}') `
}