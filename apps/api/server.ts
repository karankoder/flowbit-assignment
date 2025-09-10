import { app } from './app';
import { connectDB } from './data/database';

connectDB();

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
