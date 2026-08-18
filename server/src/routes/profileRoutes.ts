import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { updateProfileSchema } from '../validators/profileValidator';

const router = Router();

router.put('/me', authenticate, validate(updateProfileSchema), ProfileController.updateProfile);
router.post('/photos', authenticate, upload.single('photo'), ProfileController.addPhoto);
router.delete('/photos/:photoId', authenticate, ProfileController.deletePhoto);
router.delete('/me', authenticate, ProfileController.deleteAccount);
router.get('/:id', authenticate, ProfileController.getProfileById);

export default router;
