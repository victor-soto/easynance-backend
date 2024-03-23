import { SignInput, SignOutput } from './types'

export abstract class ITokenAdapter {
  abstract sign(model: SignInput): SignOutput
}
