// Login simulado contra el usuario mock
export const LOGIN = `
  mutation Login($correo: String!, $contrasena: String!) {
    login(correo: $correo, contrasena: $contrasena) { id nombre correo }
  }
`
