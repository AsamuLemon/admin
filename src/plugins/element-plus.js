import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import ElementUI from 'element-plus'

export function setupElementPlus(app) {
    app.use(ElementUI,{locale})
    // components.forEach((component) => {
    //     app.use(component,{ locale })
    // });
}