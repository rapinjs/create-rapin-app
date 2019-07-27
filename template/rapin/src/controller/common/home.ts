import {Controller, GET} from 'rapin'

export class ControllerCommonHome extends Controller {
    @GET('/home')
    public async index() {
        this.$context.response.setOutput(await this.$context.load.view('common/home', {}))
    }
}