import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await connectMongo();

  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Geçersiz e-posta veya şifre' }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Geçersiz e-posta veya şifre' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!
    );

    const response = new Response(JSON.stringify({ token }), { status: 200 });

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error('Sign in Error: ', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
