import { JwtType, SignInput, SignOutput } from './types'

export abstract class ITokenAdapter {
  abstract sign(model: SignInput): SignOutput
  abstract verify(token: string): Promise<JwtType>
}
