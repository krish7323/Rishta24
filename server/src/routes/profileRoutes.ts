import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { updateProfileSchema } from '../validators/profileValidator';

const router = Router();

router.put('/me', authenticate, validate(updateProfileSchema), ProfileController.updateProfile);
router.post('/photos', authenticate, upload.single('photo'), ProfileController.addPhoto);
router.put('/photos/:photoId/primary', authenticate, ProfileController.setPrimaryPhoto);
router.delete('/photos/:photoId', authenticate, ProfileController.deletePhoto);
router.post('/request-photo-access', authenticate, ProfileController.requestPhotoAccess);
router.post('/approve-photo-access', authenticate, ProfileController.approvePhotoAccess);
router.post('/pause', authenticate, ProfileController.pauseAccount);
router.post('/hide', authenticate, ProfileController.hideProfile);
router.delete('/me', authenticate, ProfileController.deleteAccount);
router.get('/:id', authenticate, ProfileController.getProfileById);

export default router;

