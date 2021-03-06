/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express';
import { CallbackError } from 'mongoose';
import { Homework } from '../../models/Homework';

import { authenticate } from './util';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: req.originalUrl,
    });
});

router.post('/get', (req, res) => {
    authenticate(req.body.sessionId)
        .then(async authResult => {
            if (!authResult.ok) {
                res.status(401);
                res.json({ message: 'not authorized' });
            } else {
                const homework = await Homework.find({
                    user: authResult.userId,
                });
                res.json({ homework });
            }
        })
        .catch(err => console.error(err));
});

router.post('/add', (req, res) => {
    authenticate(req.body.sessionId)
        .then(authResult => {
            if (!authResult.ok) {
                res.status(401);
                res.json({ message: 'not authorized' });
            } else {
                Homework.create(
                    {
                        user: authResult.userId,
                        type: req.body.type,
                        input: req.body.input,
                    },
                    err => {
                        if (err) {
                            res.status(406);
                            res.json({
                                title: 'error creating new homework',
                                message: err.message,
                            });
                        } else {
                            res.json({
                                title: 'successfully create new homework',
                            });
                        }
                    }
                );
            }
        })
        .catch(err => console.error(err));
});

router.delete('/:id', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    authenticate(req.body.sessionId)
        .then(authResult => {
            if (!authResult.ok) {
                res.status(401);
                res.json({ message: 'not authorized' });
            } else {
                void Homework.deleteOne(
                    {
                        _id: req.params.id,
                    },
                    undefined,
                    (err: CallbackError) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            res.send({ message: `${req.params.id} deleted` });
                        }
                    }
                );
            }
        })
        .catch(err => console.error(err));
});

export default router;
