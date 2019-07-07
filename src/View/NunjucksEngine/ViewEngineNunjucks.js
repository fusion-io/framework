export default class ViewEngineNunjucks {

    constructor(nunjucks) {
        this.nunjucks = nunjucks;
    }

    /**
     *
     * @return {nunjucks.Environment}
     */
    getEnv() {
        return this.nunjucks;
    }

    /**
     *
     * @param {FirstStepView} firstStepView
     */
    render(firstStepView) {
        return this.nunjucks.render(
            this.resolveSecondStepViewName(firstStepView.getView()),
            firstStepView.getData()
        );
    }

    resolveSecondStepViewName(firstStepViewName) {
        return (firstStepViewName.split('.').join('/')) + '.njk.html';
    }
}
