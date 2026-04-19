// interfaces for Model, ViewModel, and Persistence.

// Model: Represents the core user data structure within the authentication context.
export interface AuthUserModel {
  userIDP: string;
  emailID: string;
  userName: string;
  roleName: string;
  token: string;
  sessionId?: string;
}

// Model: Represents the payload used for authentication requests.
export interface LoginModel {
  userName: string;
  password: string;
}

// Model: Represents the structured response from an authentication request.
export interface AuthResponseModel extends AuthUserModel {
  message?: string;
}
